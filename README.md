# nest-cqrs

The `nest-cqrs` packages provide a framework for implementing CQRS and EventSourced applications using NestJS. The makers of NestJS provide a [recipe for CQRS](https://docs.nestjs.com/recipes/cqrs) however this is sufficient only for a proof-of-concept environment and doesn’t encourage best practices:

- The use of RxJS to create a one-to-many bus limits command/event/query processing to a single node, meaning…
  - The application MUST run as a singular monolith with limited ability to scale horizontally
  - All commands/events/queries present but un-processed on a node will disappear at shutdown
- Command handlers are allowed to return data, implicitly allowing inexperienced developers to violate the CQRS pattern
- There is no in-built way to handle Saga rollbacks and compensating events
- Overall, there is very little structure to encourage best practices; most features must be implemented by the developers

Of course these limitations can be overcome in a variety of ways, however these are not insignificant challenges and must be done carefully to ensure the long term stability of the application. The `nest-cqrs` packages provide much of the missing functionality from the NestJS/CQRS module with a tight coupling to event sourcing and the added advantage of enabling teams to change technologies as the needs of the application change.

## Recommended Reading

- [Martin Fowler on CQRS](https://martinfowler.com/bliki/CQRS.html)
- [Martin Fowler on DDD](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Martin Fowler on Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Udi Dahan on Race Conditions](https://udidahan.com/2010/08/31/race-conditions-dont-exist/)
- [Yves Reynhout on Models](youtube.com/watch?v=7StN-vNjRSw)
- [Microsoft on CQRS](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Microservices.io on EventSourcing](https://microservices.io/patterns/data/event-sourcing.html)
- [Greg Young: Versioning in an Event Sourced System](https://leanpub.com/esversioning/read)

## Usage

The `@nest-cqrs/core` module provides a `CQRSModule` as an entrypoint for the framework. For usage and configuration of this module and any other package, please consult the relevant package READMEs.

## Backends

Currently supported event stores:

- [x] EventStoreDB
