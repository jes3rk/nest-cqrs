# nest-messenger

Internal messaging service for NestJS applications via the EventEmitter API. Allows for the passing of ephemeral messages between services, for example control signals to auto-reconnect to external services.

## Usage

1. Import the `MessengerModule` in all modules that should access the messenger
2. Inject the `MessengerService` in a provider and use as needed
