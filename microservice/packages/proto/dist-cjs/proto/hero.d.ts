import { Observable } from "rxjs";
export declare const protobufPackage = "hero";
export interface HeroById {
    id: number;
}
export interface Hero {
    id: number;
    name: string;
}
export interface ServerStreamRequest {
    num: number;
}
export interface ServerStreamResponse {
    num: number;
}
export interface ClientStreamRequest {
    num: number;
}
export interface ClientStreamResponse {
    num: number;
}
export interface TwoWayStreamRequest {
    num: number;
}
export interface TwoWayStreamResponse {
    num: number;
}
export interface HeroesService {
    FindOne(request: HeroById): Promise<Hero>;
    ServerStream(request: ServerStreamRequest): Observable<ServerStreamResponse>;
    ClientStream(request: Observable<ClientStreamRequest>): Promise<ClientStreamResponse>;
    TwoWayStream(request: Observable<TwoWayStreamRequest>): Observable<TwoWayStreamResponse>;
}
