package main

import (
	"context"
	"fmt"
	"log"
	"learn-hero/hero"
	"google.golang.org/grpc"
)

func main() {
	cc, err := grpc.Dial("localhost:3001", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("could not connect: %v", err)
	}
	defer cc.Close()

	client := hero.NewHeroesServiceClient(cc)

	fmt.Printf("client started\n")
	callSum(client)

}

func callSum(c hero.HeroesServiceClient) {
	req := &hero.HeroById{
		Id: 1,
	}
	res, err := c.FindOne(context.Background(), req)
	if err != nil {
		log.Fatalf("error while calling Sum RPC: %v", err)
	}
	log.Printf("Response from Sum: %v", res)
}
