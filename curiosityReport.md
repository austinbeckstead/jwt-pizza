# Curiosity Report: OpenTelemetry

## Why I was interested
I interned at a company with a microservice cloud backend stack. The company used OpenTelemetry through a code-based instrumentation solution. I worked on services with that code implemented, but never understood what telemetry was for. When working on the jwt-pizza-service metrics, I was curious about how real companies approach observability. Researching OpenTelemetry gave me a clearer picture of how observability is implemented and the utility it provides to software on the cloud. 

## Advantages of using OpenTelemetry
1. Improved observability
    - Efficiently gathers data relating to application bottlenecks
    - Consistent accross programming languages
    - Supports a lot of different services
3. Automatic instrumentation
    - Built in instrumentation libraries
    - Some features require no code changes
    - Minimal added complexity to code
4. Community driven
    - Users can choose their own backend platform
    - Continual innovation 
    - Very modifiable 
    
## Key Components
- OpenTelemetry Protocol (OTLP), a specification that defines how telemetry data is encoded and exchanged.
- An API and SDKs for code-based instrumentation
- OpenTelemetry Collector to receive, process, store, and export telemetry data

## Instrumentation
Instrumentation is the process of adding sensors to your project to generate telemtry data
### instrumentation.mjs
Sets up, configures, and runs the OpenTelemetry SDK <br> <br>
Setup Parameters:
- traceExporter: Records request path
- metricReader: Collects measurements like request counts, latency, memory usage, etc
- exporter: Sends collected telemetry data to a specified destination
- instrumentations: modules that provide predefined instrumentation

### Adding OpenTelemetry to your codebase 
1. Install the sdk: <br>
`npm install @opentelemetry/sdk-node \
  @opentelemetry/api \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/sdk-metrics \
  @opentelemetry/sdk-trace-node`

2. Create a file called instrumentation.mjs <br>

    ```import { NodeSDK } from '@opentelemetry/sdk-node';
    import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
    import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
    import {
    PeriodicExportingMetricReader,
    ConsoleMetricExporter,
    } from '@opentelemetry/sdk-metrics';

    const sdk = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();```

3. Record metrics

    ```
        import { metrics } from '@opentelemetry/api';

        const meter = metrics.getMeter('example-meter');
        const counter = meter.createCounter('my_counter');
        counter.add(1); // This sends a metric with value 1
    ```

## Summary

OpenTelemetry is a powerful, open-source observability framework that standardizes the collection and export of telemetry data such as traces and metrics. It simplifies monitoring distributed systems, supports multiple languages and platforms, and is widely adopted in cloud-native environments. Integrating OpenTelemetry into a project enables better visibility, faster troubleshooting, and improved reliability for modern applications. Researching it has given me a better idea of how telemetry is implemented in real tech stacks and how crucial observability is to the success of cloud infrastructure. 