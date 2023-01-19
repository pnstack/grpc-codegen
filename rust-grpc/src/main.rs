use hero::{
    heroes_service_server::{HeroesService, HeroesServiceServer},
    *,
};
use tonic::{transport::Server, Request, Response, Status};

mod hero;

#[derive(Debug, Default)]
pub struct HeroService;

#[tonic::async_trait]
impl HeroesService for HeroService {
    async fn find_one(
        &self,
        request: tonic::Request<HeroById>,
    ) -> Result<tonic::Response<Hero>, tonic::Status> {
        Ok(Response::new(hero::Hero {
            id: 1,
            name: "scd".to_string(),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:3001".parse().unwrap();
    println!("Start server");

    let voting_service = HeroService::default();

    Server::builder()
        .add_service(HeroesServiceServer::new(voting_service))
        .serve(addr)
        .await?;
    Ok(())
}
