# Incident: 2026-04-05 13:40:00

## Summary

Between the hour of 13:35 and 14:00 on 2026-04-05, 2 users encountered pizza creation failures. The event was triggered by a increase of pizza creation failures at 13:45:00.

A bug in the factory code caused orders to not be fulfilled. The event was detected by Grafana. The team started working on the event by 13:48 MDT. This severe incident affected 100% of users.

## Detection

> I detected the incident at 13:45:00 because of an alert from an increase in pizza creation errors on my grafana dashboard? I got to it pretty quickly, but this could be slightly improved by lowering the threshold to pick up on errors before it is a widespread issue.

## Impact

For 0 hrs 18 minutes between 13:40 MDT and 13:58 MDT on 04/05/26, our users could not checkout without their order failing to be fulfilled at the factory.

This incident affected 100% of customers.

## Timeline

All times are MDT.

- _13:45_ - I receive grafana alert of an influx in error responses
- _13:48_ - I start investigating my metrics and logs
- _13:57_ - I find the logs containing the issue
- _13:58_ - I click on the link to fix the issue with the pizza factory
- _14:00_ - Pizza factory function returns

## Response

After receiving a page at 13:45 MDT, I came online at 13:48 MDT in Grafana.

## Root cause

A bug in pizza factory led to failed to fulfill order error. Likely due to me hitting 'initiate chaos' the day prior.

## Resolution

By looking at my error response logs from the pizza factory and clicking on the link to end the chaos, the problem was neutralized. 

## Prevention

This incident caused no other reported issues.

## Action items

1. In the future, do not hit 'initiate chaos' on the pizza factory page
2. Reduce threshold of errors before an alert is sent
3. Provide a backup pizza factory in case of failure. 
