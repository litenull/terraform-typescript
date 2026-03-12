type Resource<Kinds extends string, Props> = {
  kind: Kinds
  props: Props
  id?: string
}

type ResourceState<Kinds extends string, Props> = {
  kind: Kinds
  props: Props
  id: string
  createdAt: number
}

type VPC = Resource<'vpc', { cidr: string; name: string }>
type Subnet = Resource<'subnet', { vpcId: string; cidr: string; az: string }>
type Instance = Resource<'instance', { subnetId: string; type: string; ami: string }>

type AllResources = VPC | Subnet | Instance

type Dependencies<R extends AllResources> = 
  R extends Subnet ? ['vpc']
  : R extends Instance ? ['subnet']
  : []

type Plan<R extends AllResources, Existing extends ResourceState<string, any>[]> = {
  resource: R
  action: R['id'] extends string ? 'update' | 'destroy' : 'create'
  dependsOn: Dependencies<R>
}

type State<Resources extends ResourceState<string, any>[]> = {
  resources: Resources
  version: number
}

type Apply<
  Plan extends { resource: AllResources; action: string }[],
  CurrentState extends ResourceState<string, any>[]
> = {
  plans: Plan
  before: CurrentState
  after: ResourceState<string, any>[]
}

type MyVPC = VPC & { props: { cidr: '10.0.0.0/16'; name: 'main' } }
type MySubnet = Subnet & { props: { vpcId: string; cidr: '10.0.1.0/24'; az: 'us-east-1a' } }
type MyInstance = Instance & { props: { subnetId: string; type: 't3.micro'; ami: 'ami-12345' } }

type MyPlan = [
  Plan<MyVPC, []>,
  Plan<MySubnet, []>,
  Plan<MyInstance, []>
]

type DependenciesTest = Dependencies<Subnet>
type DependenciesTest2 = Dependencies<Instance>
