# Multi-Language gRPC Code Generator Examples

This document provides examples of how to use the generated gRPC code in each supported language.

## Generated Files Structure

After running `npm run build`, the following files are generated:

```
generated/
├── go/
│   ├── calculator.pb.go           # Protocol buffer messages for Go
│   ├── calculator_grpc.pb.go      # gRPC service definitions for Go
│   ├── hero.pb.go
│   └── hero_grpc.pb.go
├── python/
│   ├── calculator_pb2.py          # Protocol buffer messages for Python
│   ├── calculator_pb2.pyi         # Type hints for Python
│   ├── calculator_pb2_grpc.py     # gRPC service definitions for Python
│   ├── hero_pb2.py
│   ├── hero_pb2.pyi
│   └── hero_pb2_grpc.py
├── typescript/
│   ├── calculator.ts              # General TypeScript interfaces
│   ├── hero.ts
│   └── nestjs/
│       ├── calculator.ts          # NestJS-specific decorators and metadata
│       └── hero.ts
└── rust/
    ├── Cargo.toml                 # Rust project configuration
    ├── build.rs                   # Build script for code generation
    └── src/
        ├── lib.rs                 # Main library file
        ├── calculator.rs          # Calculator service definitions
        └── hero.rs                # Hero service definitions
```

## Usage Examples

### Go Example

```go
package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    pb "path/to/generated/go" // Adjust import path
)

// Implement the HeroesService
type heroServer struct {
    pb.UnimplementedHeroesServiceServer
}

func (s *heroServer) FindOne(ctx context.Context, req *pb.HeroById) (*pb.Hero, error) {
    return &pb.Hero{
        Id:   req.Id,
        Name: "Hero " + string(req.Id),
    }, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    s := grpc.NewServer()
    pb.RegisterHeroesServiceServer(s, &heroServer{})

    log.Println("Server listening on :50051")
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
```

### Python Example

```python
import grpc
from concurrent import futures
import hero_pb2
import hero_pb2_grpc

class HeroesService(hero_pb2_grpc.HeroesServiceServicer):
    def FindOne(self, request, context):
        return hero_pb2.Hero(
            id=request.id,
            name=f"Hero {request.id}"
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    hero_pb2_grpc.add_HeroesServiceServicer_to_server(HeroesService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server listening on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
```

### TypeScript/NestJS Example

```typescript
// hero.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { HeroById, Hero, HeroesServiceController } from './generated/typescript/nestjs/hero';

@Controller()
export class HeroController implements HeroesServiceController {
  @GrpcMethod('HeroesService', 'FindOne')
  findOne(data: HeroById): Hero {
    return {
      id: data.id,
      name: `Hero ${data.id}`,
    };
  }
}

// main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, '../proto/hero.proto'),
      url: 'localhost:50051',
    },
  });

  await app.listen();
  console.log('NestJS gRPC server listening on localhost:50051');
}

bootstrap();
```

### Rust Example

```rust
// src/main.rs
use tonic::{transport::Server, Request, Response, Status};
use grpc_generated::hero::{
    heroes_service_server::{HeroesService, HeroesServiceServer},
    Hero, HeroById,
};

#[derive(Debug, Default)]
pub struct MyHeroesService {}

#[tonic::async_trait]
impl HeroesService for MyHeroesService {
    async fn find_one(
        &self,
        request: Request<HeroById>,
    ) -> Result<Response<Hero>, Status> {
        let req = request.into_inner();
        
        let hero = Hero {
            id: req.id,
            name: format!("Hero {}", req.id),
        };

        Ok(Response::new(hero))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let heroes_service = MyHeroesService::default();

    println!("HeroesService Server listening on {}", addr);

    Server::builder()
        .add_service(HeroesServiceServer::new(heroes_service))
        .serve(addr)
        .await?;

    Ok(())
}
```

## Client Examples

### Go Client

```go
package main

import (
    "context"
    "log"

    "google.golang.org/grpc"
    pb "path/to/generated/go"
)

func main() {
    conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Failed to connect: %v", err)
    }
    defer conn.Close()

    client := pb.NewHeroesServiceClient(conn)
    
    response, err := client.FindOne(context.Background(), &pb.HeroById{Id: 1})
    if err != nil {
        log.Fatalf("FindOne failed: %v", err)
    }
    
    log.Printf("Hero: %s", response.Name)
}
```

### Python Client

```python
import grpc
import hero_pb2
import hero_pb2_grpc

def run():
    channel = grpc.insecure_channel('localhost:50051')
    stub = hero_pb2_grpc.HeroesServiceStub(channel)
    
    response = stub.FindOne(hero_pb2.HeroById(id=1))
    print(f"Hero: {response.name}")

if __name__ == '__main__':
    run()
```

## Build and Run Instructions

1. **Generate code**: `npm run build`
2. **Go**: Copy generated files to your Go project and run
3. **Python**: Install dependencies with `pip install grpcio grpcio-tools`, then run
4. **TypeScript/NestJS**: Install dependencies with `npm install @nestjs/microservices`, then run
5. **Rust**: Navigate to `generated/rust` directory and run `cargo run`

## Adding New Services

1. Create or modify `.proto` files in the `proto/` directory
2. Run `npm run build` to regenerate code for all languages
3. Implement the new services in your chosen language(s)

The code generator automatically handles all the Protocol Buffer compilation and language-specific code generation, making it easy to maintain consistency across multiple services and languages.