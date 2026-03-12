# Type-Level Terraform Replica

A TypeScript implementation of Terraform concepts using only the type system. No runtime code - pure type-level infrastructure modeling.

## Overview

This project demonstrates how TypeScript's type system can model infrastructure-as-code concepts similar to Terraform. It provides compile-time guarantees for resource definitions, dependencies, and state management.

## Features

- **Type-Safe Resources**: Define cloud resources with strongly-typed properties
- **Automatic Dependency Tracking**: Dependencies are inferred from resource types
- **State Management**: Model infrastructure state with versioning
- **Plan Generation**: Determine create/update/destroy actions at the type level
- **Zero Runtime**: Everything happens at compile time

## Installation

```bash
# Clone or copy the terraform-types.ts file to your project
# No dependencies required - uses only TypeScript built-in types
```

## Resource Types

### VPC (Virtual Private Cloud)
```typescript
type MyVPC = VPC & { props: { cidr: '10.0.0.0/16'; name: 'main' } }
```

### Subnet
```typescript
type MySubnet = Subnet & { 
  props: { 
    vpcId: string
    cidr: '10.0.1.0/24'
    az: 'us-east-1a' 
  } 
}
```

### Instance
```typescript
type MyInstance = Instance & { 
  props: { 
    subnetId: string
    type: 't3.micro'
    ami: 'ami-12345' 
  } 
}
```

## Usage Examples

### Define Infrastructure

```typescript
type MyInfrastructure = [
  Plan<MyVPC, []>,
  Plan<MySubnet, []>,
  Plan<MyInstance, []>
]
```

### Check Dependencies

```typescript
type VPCDeps = Dependencies<VPC>        // []
type SubnetDeps = Dependencies<Subnet>  // ['vpc']
type InstanceDeps = Dependencies<Instance> // ['subnet']
```

### Model State Changes

```typescript
type InitialState = State<[]>
type AfterVPC = State<[ResourceState<'vpc', { cidr: string; name: string }>]>
```

## Core Concepts

### Resource
A type representing a cloud resource definition without runtime state.

### ResourceState
A resource with runtime metadata including:
- Unique identifier
- Creation timestamp
- Original properties

### Plan
Describes intended actions on resources:
- `create` - New resource to be provisioned
- `update` - Existing resource to be modified
- `destroy` - Resource to be deleted

### State
Represents the current infrastructure state with:
- Array of resource states
- Version number for tracking changes

### Apply
Type-level function that transforms plans into state transitions.

## Type Tests

```typescript
// Valid transitions
type Test1 = Transition<'idle', 'load'>           // 'loading'
type Test2 = Transition<'loading', 'success'>     // 'success'

// Invalid transitions return never
type Test3 = Transition<'idle', 'success'>        // never
type Test4 = Transition<'error', 'load'>          // never

// Dependency resolution
type Test5 = Dependencies<Subnet>                 // ['vpc']
type Test6 = Dependencies<Instance>               // ['subnet']
type Test7 = Dependencies<VPC>                    // []
```

## Extending

Add new resource types by extending the union:

```typescript
type S3Bucket = Resource<'s3', { bucketName: string; region: string }>
type AllResources = VPC | Subnet | Instance | S3Bucket

type Dependencies<R extends AllResources> = 
  R extends Subnet ? ['vpc']
  : R extends Instance ? ['subnet']
  : R extends S3Bucket ? [] // S3 has no dependencies
  : []
```

