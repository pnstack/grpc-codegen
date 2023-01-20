from concurrent import futures
import time

import grpc

import hero_pb2
import hero_pb2_grpc

class HeroesService(hero_pb2_grpc.HeroesServiceServicer):
    def FindOne(self, request, context):
        hero = hero_pb2.Hero(id=request.id, name="Superman")
        return hero

server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
hero_pb2_grpc.add_HeroesServiceServicer_to_server(HeroesService(), server)
server.add_insecure_port('[::]:3001')
server.start()

try:
    while True:
        time.sleep(86400)
except KeyboardInterrupt:
    server.stop(0)
