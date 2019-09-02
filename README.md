# Churras Trinca Backend

Backend challenge using GraphQL and DataLoader

### Directory Structure

```
├── /data/                   # GraphQL generated schema
├── /repl/                   # Read-Eval-Print-Loop (REPL) configuration
├── /scripts/                # Generate GraphQL schema script
├── /src/                    # Source code of GraphQL Server
│   ├── /core/               # Core types and helper files, can be used like a global module
│   ├── /interface/          # NodeInterface (Relay) and other GraphQL Interfaces
│   ├── /modules/            # Modules (think on modules like isolated pieces of your code)
│   │   │── /mutation/       # Module mutations (add an index file to be used on MutationType)
│   │   │── /subscription/   # Module subscriptions (add an index file to be used on SubscriptionType)
│   │   │── /enum/           # Enums related to this module
├── /test/                   # Test helpers
```

For generate modules use my CLI [graphql-scripts](https://github.com/Bastiani/graphql-scripts)
![](https://github.com/Bastiani/bastiani-blog/blob/master/graphql-cli.png)

## Command

#### Setup

```bash
yarn install
```

Note: If you do not have mongodb installed, please install it:

```bash
brew install mongodb
```

Run server

```bash
yarn start
```

Playground: `http://localhost:5000/graphiql`
