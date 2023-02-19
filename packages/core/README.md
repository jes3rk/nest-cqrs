# @nest-cqrs/core

The core module for the `nest-cqrs` framework.

## Usage

The core package provides a `CQRSModule` for working with the framework.

At the app module

```ts
@Module({
    imports: [
        CQRSModule.forRoot({
            applicationName: // global namespace of the application
            eventStoreConfig: // injectable configuration for the event store
        }),
    ]
})
export class AppModule {}
```

Notice the `eventStoreConfig` parameter. This is what enables support for multiple event stores in the background. Use the exported config object from another package (or make your own!) here and configure accordingly.

At the module level, inject the relevant providers via

```ts
@Module({
    imports: [
        CQRSModule.forFeature({
            namespace: // namespace for grouping related modules
        })
    ]
})
export class DomainMdoule {}
```

The namespace parameter here is crucial. All modules sharing the same namespace are treated as one client for listening to events. This means that different namespaces can process events at different rates depending on the processing requirements, freeing up compute resources and enabling native support for distributed systems.
