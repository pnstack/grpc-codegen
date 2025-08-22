# Multi-Language gRPC Code Generator

A unified build tool that generates gRPC server and client code for multiple programming languages from a single set of Protocol Buffer definitions.

## Supported Languages

- **Go** - Server and client code generation
- **Python** - Server and client code generation  
- **TypeScript/NestJS** - Both general TypeScript and NestJS-specific code
- **Rust** - Server and client code using Tonic

## Features

- ✅ Centralized `.proto` file management
- ✅ One command to generate code for all languages
- ✅ Language-specific optimizations and configurations
- ✅ Automatic dependency management
- ✅ Clean, organized output structure
- ✅ Support for all gRPC features (unary, streaming, bidirectional)

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate code for all languages**:
   ```bash
   npm run build
   ```

3. **Generate code for specific language**:
   ```bash
   npm run build:go
   npm run build:python
   npm run build:typescript
   npm run build:rust
   ```

## Directory Structure

```
├── proto/                    # Protocol Buffer definitions
│   ├── hero.proto
│   └── calculator.proto
├── generated/                # Generated code output
│   ├── go/                   # Go generated files
│   ├── python/               # Python generated files
│   ├── typescript/           # TypeScript generated files
│   │   └── nestjs/           # NestJS-specific files
│   └── rust/                 # Rust generated files
├── codegen.js               # Main build tool
├── package.json             # Build tool dependencies
├── BUILD.md                 # Build tool documentation
└── EXAMPLES.md              # Usage examples
```

## Example Proto File

```proto
syntax = "proto3";
package hero;

option go_package = "./hero";

message HeroById { 
  int32 id = 1; 
}

message Hero {
  int32 id = 1;
  string name = 2;
}

service HeroesService {
  rpc FindOne(HeroById) returns (Hero) {}
  rpc ServerStream(ServerStreamRequest) returns (stream ServerStreamResponse) {}
  rpc ClientStream(stream ClientStreamRequest) returns (ClientStreamResponse) {}
  rpc TwoWayStream(stream TwoWayStreamRequest) returns (stream TwoWayStreamResponse) {}
}
```

## Introduction to gRPC

gRPC is a high-performance, open-source framework for building remote procedure call (RPC) APIs. It uses the Protocol Buffers data serialization format and allows for the communication between services in a variety of programming languages. gRPC is designed to be fast, efficient, and scalable, making it a popular choice for building microservices and other distributed systems.

## Introduction to Protocol Buffers

Protocol Buffers is a data serialization format that allows for the encoding and decoding of structured data. It is a language-neutral, platform-neutral, extensible mechanism for serializing structured data. Protocol Buffers are used by gRPC to define the structure of messages that are exchanged between services.

## Repository Contents

- **Multi-language examples** - Complete working examples in Go, Python, TypeScript/NestJS, and Rust
- **Build tool** - Unified code generation for all languages
- **Documentation** - Comprehensive guides and examples
- **Proto definitions** - Centralized Protocol Buffer definitions