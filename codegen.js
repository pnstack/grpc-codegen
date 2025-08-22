#!/usr/bin/env node

const { Command } = require('commander');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

// Configuration
const PROTO_DIR = path.join(__dirname, 'proto');
const GENERATED_DIR = path.join(__dirname, 'generated');
const PROTOC_PATH = path.join(__dirname, 'protoc', 'bin', 'protoc');

// Ensure protoc exists
if (!fs.existsSync(PROTOC_PATH)) {
    console.error(chalk.red('Error: protoc not found. Please install Protocol Buffers compiler.'));
    process.exit(1);
}

// Language-specific generators
const generators = {
    go: {
        name: 'Go',
        outputDir: path.join(GENERATED_DIR, 'go'),
        generate: (protoFiles) => {
            console.log(chalk.blue(`Generating Go code...`));
            
            // Install Go plugins if not present
            try {
                execSync('go install google.golang.org/protobuf/cmd/protoc-gen-go@latest', { stdio: 'inherit' });
                execSync('go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest', { stdio: 'inherit' });
            } catch (error) {
                console.log(chalk.yellow('Note: Go plugins installation may have failed. Make sure Go is installed and $GOPATH/bin is in PATH.'));
            }

            // Add GOPATH/bin to PATH
            const goPath = execSync('go env GOPATH', { encoding: 'utf-8' }).trim();
            const newPath = `${goPath}/bin:${process.env.PATH}`;

            for (const protoFile of protoFiles) {
                const cmd = `${PROTOC_PATH} --go_out=${generators.go.outputDir} --go_opt=paths=source_relative --go-grpc_out=${generators.go.outputDir} --go-grpc_opt=paths=source_relative --proto_path=${PROTO_DIR} ${protoFile}`;
                
                try {
                    execSync(cmd, { stdio: 'inherit', env: { ...process.env, PATH: newPath } });
                    console.log(chalk.green(`✓ Generated Go code for ${protoFile}`));
                } catch (error) {
                    console.error(chalk.red(`✗ Failed to generate Go code for ${protoFile}: ${error.message}`));
                }
            }
        }
    },

    python: {
        name: 'Python',
        outputDir: path.join(GENERATED_DIR, 'python'),
        generate: (protoFiles) => {
            console.log(chalk.blue(`Generating Python code...`));
            
            // Install grpcio-tools if not present
            try {
                execSync('pip3 install grpcio-tools', { stdio: 'inherit' });
            } catch (error) {
                console.log(chalk.yellow('Note: grpcio-tools installation may have failed. Make sure Python and pip are installed.'));
            }

            for (const protoFile of protoFiles) {
                const cmd = `python3 -m grpc_tools.protoc --proto_path=${PROTO_DIR} --python_out=${generators.python.outputDir} --pyi_out=${generators.python.outputDir} --grpc_python_out=${generators.python.outputDir} ${protoFile}`;
                
                try {
                    execSync(cmd, { stdio: 'inherit' });
                    console.log(chalk.green(`✓ Generated Python code for ${protoFile}`));
                } catch (error) {
                    console.error(chalk.red(`✗ Failed to generate Python code for ${protoFile}: ${error.message}`));
                }
            }
        }
    },

    typescript: {
        name: 'TypeScript (NestJS)',
        outputDir: path.join(GENERATED_DIR, 'typescript'),
        generate: (protoFiles) => {
            console.log(chalk.blue(`Generating TypeScript code for NestJS...`));

            for (const protoFile of protoFiles) {
                // Generate for general TypeScript
                const cmd1 = `${PROTOC_PATH} --plugin=protoc-gen-ts_proto=${path.join(__dirname, 'node_modules', '.bin', 'protoc-gen-ts_proto')} --ts_proto_out=${generators.typescript.outputDir} --proto_path=${PROTO_DIR} ${protoFile} --ts_proto_opt=outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false`;
                
                // Generate for NestJS
                const cmd2 = `${PROTOC_PATH} --plugin=protoc-gen-ts_proto=${path.join(__dirname, 'node_modules', '.bin', 'protoc-gen-ts_proto')} --ts_proto_out=${path.join(generators.typescript.outputDir, 'nestjs')} --proto_path=${PROTO_DIR} ${protoFile} --ts_proto_opt=nestJs=true,addGrpcMetadata=true,addNestjsRestParameter=true`;
                
                try {
                    // Ensure nestjs subdirectory exists
                    fs.mkdirSync(path.join(generators.typescript.outputDir, 'nestjs'), { recursive: true });
                    
                    execSync(cmd1, { stdio: 'inherit' });
                    execSync(cmd2, { stdio: 'inherit' });
                    console.log(chalk.green(`✓ Generated TypeScript code for ${protoFile}`));
                } catch (error) {
                    console.error(chalk.red(`✗ Failed to generate TypeScript code for ${protoFile}: ${error.message}`));
                }
            }
        }
    },

    rust: {
        name: 'Rust',
        outputDir: path.join(GENERATED_DIR, 'rust'),
        generate: (protoFiles) => {
            console.log(chalk.blue(`Generating Rust code...`));
            
            // Create a basic Cargo.toml for the generated code
            const cargoToml = `[package]
name = "grpc-generated"
version = "0.1.0"
edition = "2021"

[dependencies]
tonic = "0.10"
prost = "0.12"
tokio = { version = "1.0", features = ["macros", "rt-multi-thread"] }

[build-dependencies]
tonic-build = "0.10"
`;

            const buildRs = `fn main() {
    let proto_files = vec![
${protoFiles.map(f => `        "${f}",`).join('\n')}
    ];
    
    tonic_build::configure()
        .build_server(true)
        .out_dir("./src")
        .compile(&proto_files, &["${PROTO_DIR}"])
        .unwrap_or_else(|e| panic!("protobuf compile error: {}", e));
        
    for proto_file in &proto_files {
        println!("cargo:rerun-if-changed=${PROTO_DIR}/{}", proto_file);
    }
}`;

            try {
                fs.writeFileSync(path.join(generators.rust.outputDir, 'Cargo.toml'), cargoToml);
                fs.writeFileSync(path.join(generators.rust.outputDir, 'build.rs'), buildRs);
                fs.mkdirSync(path.join(generators.rust.outputDir, 'src'), { recursive: true });
                
                // Create a basic lib.rs that will be populated after build
                let libRs = '// Generated gRPC code will be included here\n';
                fs.writeFileSync(path.join(generators.rust.outputDir, 'src', 'lib.rs'), libRs);
                
                // Run the build process which will generate the actual proto files
                console.log(chalk.blue('Running tonic-build to generate proto files...'));
                execSync('cargo build', { cwd: generators.rust.outputDir, stdio: 'inherit' });
                
                // Now find the generated files and update lib.rs
                const buildOutDir = path.join(generators.rust.outputDir, 'target', 'debug', 'build');
                const packageDirs = fs.readdirSync(buildOutDir).filter(d => d.startsWith('grpc-generated-'));
                
                if (packageDirs.length > 0) {
                    const outDir = path.join(buildOutDir, packageDirs[0], 'out');
                    if (fs.existsSync(outDir)) {
                        const generatedFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.rs'));
                        const modules = generatedFiles.map(f => {
                            const moduleName = f.replace('.rs', '').replace('.', '_');
                            return `pub mod ${moduleName} {\n    include!(concat!(env!("OUT_DIR"), "/${f}"));\n}`;
                        });
                        
                        libRs = '// Generated gRPC code\n' + modules.join('\n\n');
                        fs.writeFileSync(path.join(generators.rust.outputDir, 'src', 'lib.rs'), libRs);
                    }
                }
                
                console.log(chalk.green(`✓ Generated Rust code for all proto files`));
            } catch (error) {
                console.error(chalk.red(`✗ Failed to generate Rust code: ${error.message}`));
            }
        }
    }
};

function getProtoFiles() {
    if (!fs.existsSync(PROTO_DIR)) {
        console.error(chalk.red(`Error: Proto directory ${PROTO_DIR} not found.`));
        process.exit(1);
    }
    
    const files = fs.readdirSync(PROTO_DIR)
        .filter(file => file.endsWith('.proto'));
    
    if (files.length === 0) {
        console.error(chalk.red('Error: No .proto files found in proto directory.'));
        process.exit(1);
    }
    
    return files;
}

function ensureOutputDirectory(outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
}

function generateForLanguage(language) {
    const generator = generators[language];
    if (!generator) {
        console.error(chalk.red(`Error: Unsupported language '${language}'. Supported languages: ${Object.keys(generators).join(', ')}`));
        process.exit(1);
    }
    
    const protoFiles = getProtoFiles();
    ensureOutputDirectory(generator.outputDir);
    
    console.log(chalk.cyan(`Generating ${generator.name} code from ${protoFiles.length} proto file(s)...`));
    console.log(chalk.gray(`Proto files: ${protoFiles.join(', ')}`));
    console.log(chalk.gray(`Output directory: ${generator.outputDir}`));
    
    generator.generate(protoFiles);
}

function generateAll() {
    console.log(chalk.cyan('Generating code for all supported languages...'));
    
    for (const language of Object.keys(generators)) {
        console.log(chalk.cyan(`\n--- ${generators[language].name} ---`));
        try {
            generateForLanguage(language);
        } catch (error) {
            console.error(chalk.red(`Failed to generate ${generators[language].name} code: ${error.message}`));
        }
    }
    
    console.log(chalk.green('\n🎉 Code generation completed!'));
}

// CLI setup
program
    .name('grpc-codegen')
    .description('Multi-language gRPC code generator')
    .version('1.0.0');

program
    .option('-l, --language <language>', 'generate code for specific language (go, python, typescript, rust)')
    .option('--list', 'list supported languages')
    .action((options) => {
        if (options.list) {
            console.log('Supported languages:');
            for (const [key, generator] of Object.entries(generators)) {
                console.log(`  ${chalk.blue(key)}: ${generator.name}`);
            }
            return;
        }
        
        if (options.language) {
            generateForLanguage(options.language);
        } else {
            generateAll();
        }
    });

// Handle direct execution
if (require.main === module) {
    program.parse();
}