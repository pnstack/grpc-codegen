package main

import (
	"context"
	"fmt"
	"learn-hero/hero"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
)

type server struct {
	hero.HeroesServiceServer
}

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
		stream.Send(resq)
		time.Sleep(1000)
	}

	return nil
}

func (*server) ClientStream(stream hero.HeroesService_ClientStreamServer) error {
	fmt.Printf("ClientStream function was invoked with %v", stream)

	var sum int32
	for {
		req, err := stream.Recv()
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
