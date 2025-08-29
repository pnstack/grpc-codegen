# gRPC Multi-Language Code Generator

A unified build tool that generates gRPC server and client code for multiple languages from Protocol Buffer (.proto) files.

## Supported Languages

- **Go**: Server and client code using protoc-gen-go and protoc-gen-go-grpc
- **Python**: Server and client code using grpcio-tools
- **TypeScript/NestJS**: Both general TypeScript and NestJS-specific code using ts-proto
- **Rust**: Server and client code using tonic-build

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
└── package.json             # Node.js dependencies
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. The tool will automatically install language-specific dependencies when needed.

## Usage

### Generate for All Languages
```bash
npm run build
# or
node codegen.js
```

### Generate for Specific Language
```bash
# Go
npm run build:go
node codegen.js --language=go

# Python  
npm run build:python
node codegen.js --language=python

# TypeScript/NestJS
npm run build:typescript
node codegen.js --language=typescript

# Rust
npm run build:rust
node codegen.js --language=rust
```

### List Supported Languages
```bash
node codegen.js --list
```

## Adding New Proto Files

1. Add your `.proto` files to the `proto/` directory
2. Run the code generator
3. The generated code will be available in the `generated/` directory

## Example Proto File

```proto
syntax = "proto3";
package myservice;

option go_package = "./myservice";

message MyRequest {
  string name = 1;
}

message MyResponse {
  string message = 1;
}

service MyService {
  rpc SayHello(MyRequest) returns (MyResponse) {}
}
```

## Generated Code Usage

### Go
```go
import "path/to/generated/go/myservice"
```

### Python
```python
import myservice_pb2
import myservice_pb2_grpc
```

### TypeScript
```typescript
import { MyServiceClient } from './generated/typescript/myservice';
```

### Rust
```rust
use grpc_generated::myservice::{MyRequest, MyResponse};
```

## Requirements

- Node.js (for the build tool)
- Protocol Buffers compiler (included)
- Language-specific requirements:
  - Go: Go compiler and tools
  - Python: Python 3 and pip
  - TypeScript: Node.js and npm
  - Rust: Cargo and Rust toolchain