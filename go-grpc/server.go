package main

import (
	"context"
	"fmt"
	"learn-hero/hero"
	"log"
	"net"

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
