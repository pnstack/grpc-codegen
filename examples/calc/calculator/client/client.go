package main

import (
	"context"
	"fmt"
	"log"

	"github.com/npv2k1/learn-grpc/calculator/calculatorpb"
	"google.golang.org/grpc"
)

func main() {
	cc, err := grpc.Dial("localhost:8080", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("could not connect: %v", err)
	}
	defer cc.Close()

	client := calculatorpb.NewCalculatorServiceClient(cc)

	fmt.Printf("client started\n")
	callSum(client)

}

func callSum(c calculatorpb.CalculatorServiceClient) {
	req := &calculatorpb.SumRequest{
		A: 10,
		B: 20,
	}
	res, err := c.Sum(context.Background(), req)
	if err != nil {
		log.Fatalf("error while calling Sum RPC: %v", err)
	}
	log.Printf("Response from Sum: %v", res.Sum)
}
