package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"github.com/npv2k1/learn-grpc/calculator/calculatorpb"
	"google.golang.org/grpc"
)

type server struct{
	calculatorpb.CalculatorServiceServer
}





func (*server) Sum(ctx context.Context,req *calculatorpb.SumRequest) (*calculatorpb.SumResponse, error){
	fmt.Printf("Sum function was invoked with %v", req)
	resq := &calculatorpb.SumResponse{
		Sum: req.GetA() + req.GetB(),
	}
	return resq, nil;
}

func main() {
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	calculatorpb.RegisterCalculatorServiceServer(s, &server{})
	err = s.Serve(lis)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
}
