# Learn microservice GRPC

## gRPC

gRPC là một giao thức truyền đồng bộ dựa trên giao thức HTTP/2 và Protocol Buffers, cho phép các ứng dụng gọi các hàm từ xa với tốc độ cao và độ tin cậy cao. Nó hỗ trợ các nền tảng và ngôn ngữ lập trình, và cung cấp một cách dễ dàng để tạo các API mạnh mẽ và hiệu suất cao.

## Sử dụng gRPC

Tạo file hero.proto

```proto
// hero/hero.proto
syntax = "proto3";

package hero;

option go_package = "./hero";

message HeroById { int32 id = 1; }

message Hero {
  int32 id = 1;
  string name = 2;
}

message ServerStreamRequest { int32 num = 1; }

message ServerStreamResponse { int32 num = 1; }

message ClientStreamRequest { int32 num = 1; }

message ClientStreamResponse { int32 num = 1; }

message TwoWayStreamRequest { int32 num = 1; }
message TwoWayStreamResponse { int32 num = 1; }

service HeroesService {
  rpc FindOne(HeroById) returns (Hero) {}
  rpc ServerStream(ServerStreamRequest) returns (stream ServerStreamResponse) {}
  rpc ClientStream(stream ClientStreamRequest) returns (ClientStreamResponse) {}
  rpc TwoWayStream(stream TwoWayStreamRequest)
      returns (stream TwoWayStreamResponse) {}
}
```

File proto định nghĩa các message và các service và cách các message truyền đi và nhận về.

gRPC hỗ trợ các kiểu truyền tải:

- Unary: một request và một response
- Server streaming: một request và nhiều response
- Client streaming: nhiều request và một response
- Bidirectional streaming: nhiều request và nhiều response

File trên đã ví dụ tất cả các kiểu truyền tải trên.

### gRPC với go

Khởi tạo project go mới:

```bash

go mod init learn-hero

```
Lệnh trên sẽ tạo project go mới với tên module là learn-hero.

Cài đặt các thư viện cần thiết:

```bash
go get google.golang.org/grpc
go get github.com/golang/protobuf/protoc-gen-go
```

Tạo file hero.pb.go từ file hero.proto:

```bash
protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative ./hero/*.proto
```

#### Code server

Tạo file `server.go`

```go
package main

import (
	"context"
	"fmt"
	"learn-hero/hero" // import package hero
	"log"
	"net"
	"time"
	"google.golang.org/grpc"
)
// tạo struct server implement interface HeroesServiceServer
type server struct {
	hero.HeroesServiceServer
}

// implement các hàm của interface HeroesServiceServer
func (*server) FindOne(ctx context.Context, req *hero.HeroById) (*hero.Hero, error) {
	fmt.Printf("Sum function was invoked with %v", req)
	resq := &hero.Hero{
		Id:   1,
		Name: "test",
	}
	return resq, nil
}

func (*server) ServerStream(req *hero.ServerStreamRequest, stream hero.HeroesService_ServerStreamServer) error {
	fmt.Printf("ServerStream function was invoked with %v", req)

	num := req.GetNum()
	var i int32
	for i = 0; i < num; i++ {
		resq := &hero.ServerStreamResponse{
			Num: int32(i),
		}
		stream.Send(resq) // stream kết quả về client
		time.Sleep(1000)
	}

	return nil
}

func (*server) ClientStream(stream hero.HeroesService_ClientStreamServer) error {
	fmt.Printf("ClientStream function was invoked with %v", stream)

	var sum int32
	for {
		req, err := stream.Recv() // đọc du liệu stream từ client
		if err != nil {
			break
		}
		sum += req.GetNum()
	}
	resq := &hero.ClientStreamResponse{
		Num: sum,
	}
	return stream.SendAndClose(resq)
}

func (*server) TwoWayStream(stream hero.HeroesService_TwoWayStreamServer) error {
	fmt.Printf("TwoWayStream function was invoked with %v", stream)
	i := 0
	sum := int32(0)
	for {
		req, err := stream.Recv()
		if err != nil {
			break
		}

		sum += req.GetNum()
		i += 1
		if i == 3 {
			resq := &hero.TwoWayStreamResponse{
				Num: sum,
			}
			stream.Send(resq)
			sum = 0
			i = 0
		}

	}
	return nil
}

func main() {
	fmt.Println("Start grpc server")
	lis, err := net.Listen("tcp", ":3001")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	hero.RegisterHeroesServiceServer(s, &server{})
	err = s.Serve(lis)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
}
```



## gRPC với nestjs

### Server gRPC

Khởi tạo project nest mới:

```bash
nest new api
```

## gRPC với python

## gRPC với rust
