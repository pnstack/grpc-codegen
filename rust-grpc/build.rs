fn main() {
    // // compile protocol buffer using protoc
    // protoc_rust_grpc::Codegen::new()
    // .out_dir("src")
    // .input("./proto/hero.proto")
    // .rust_protobuf(true)
    // .run()
    // .expect("error compiling protocol buffer");
    let proto_file = "./proto/hero.proto";
    tonic_build::configure()
        .build_server(true)
        .out_dir("./src")
        .compile(&[proto_file], &["."])
        .unwrap_or_else(|e| panic!("protobuf compile error: {}", e));
    println!("cargo:rerun-if-changed={}", proto_file);
}
