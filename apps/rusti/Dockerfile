FROM rust:1.73 as build
WORKDIR /app
COPY . /app
RUN cargo build --bin server --release 

FROM gcr.io/distroless/cc
COPY --from=build /app/target/release/server /
EXPOSE 8080
USER nonroot
CMD ["./server"]