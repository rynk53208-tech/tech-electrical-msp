# Cloud Migration Services

> TechSupport Service Offering — Irvin's Tech Business

## Overview

End-to-end cloud migration services for businesses moving from on-premises infrastructure to AWS or Azure. We handle assessment, planning, migration, and post-migration optimization.

---

## 1. Assessment Process

### Phase 1: Discovery & Inventory (1-2 weeks)

| Activity | Deliverable |
|----------|-------------|
| Infrastructure audit | Complete hardware/software inventory |
| Application mapping | Dependency graph (DBs, APIs, services) |
| Workload profiling | CPU, memory, storage, network usage patterns |
| Security review | Current security controls & compliance requirements |
| Cost analysis | Current on-prem TCO breakdown |

### Phase 2: Readiness Evaluation (1 week)

| Area | Assessment |
|------|------------|
| **Application Readiness** | Cloud-compatible? Refactor needed? |
| **Data Readiness** | Transfer volume, bandwidth, compliance |
| **Skill Readiness** | Team cloud expertise level |
| **Security Readiness** | Identity, access, encryption gaps |
| **Compliance** | HIPAA, SOC2, PCI-DSS requirements |

### Phase 3: Strategy Recommendation (3-5 days)

- Migration pattern selection (rehost, replatform, refactor, repurchase)
- Risk assessment & mitigation plan
- Architecture blueprint
- Migration roadmap with priorities

---

## 2. Common Migrations

### On-Premises → AWS

| Source | Target AWS Service | Use Case |
|--------|-------------------|----------|
| Physical server | EC2 | General compute |
| VMware/Hyper-V | VMware Cloud on AWS | Lift & shift |
| SQL Server | RDS / Aurora | Managed databases |
| Windows Server | EC2 + Lightsail | Windows workloads |
| File storage | S3 + EFS | Object/file storage |
| Backup solutions | AWS Backup | Centralized backup |
| On-prem AD | AWS Directory Service | Identity management |

### On-Premises → Azure

| Source | Target Azure Service | Use Case |
|--------|---------------------|----------|
| Physical server | Azure VM | General compute |
| VMware | Azure VMware Solution | Lift & shift |
| SQL Server | Azure SQL / SQL Managed Instance | Managed databases |
| Windows Server | Azure VM + Windows Virtual Desktop | Windows workloads |
| File storage | Azure Files / Blob Storage | Object/file storage |
| Backup solutions | Azure Backup | Centralized backup |
| On-prem AD | Azure Active Directory | Identity management |

### Migration Patterns

1. **Rehost (Lift & Shift)** — Move as-is to cloud VMs
   - Fastest, minimal change
   - 2-4 weeks per workload

2. **Replatform (Lift & Tweak)** — Minor optimizations
   - e.g., switch to managed DB, adjust storage
   - 1-2 months per workload

3. **Refactor (Re-architect)** — Cloud-native redesign
   - Containers, serverless, microservices
   - 2-6 months per application

4. **Repurchase** — Move to SaaS
   - e.g., on-prem CRM → Salesforce
   - Varies by solution

---

## 3. Timeline Estimates

| Migration Scope | Small (≤10 VMs) | Medium (11-50 VMs) | Large (50+ VMs) |
|-----------------|-----------------|-------------------|-----------------|
| **Assessment** | 2-3 weeks | 3-4 weeks | 4-6 weeks |
| **Pilot/MVP** | 1-2 weeks | 2-3 weeks | 3-4 weeks |
| **Production Migration** | 2-4 weeks | 4-8 weeks | 8-16 weeks |
| **Testing/Validation** | 1 week | 2 weeks | 3-4 weeks |
| **Total** | **1.5-3 months** | **3-5 months** | **5-10 months** |

### Factors That Affect Timeline

- Application complexity & dependencies
- Data volume & transfer method (online vs. offline)
- Required compliance certifications
- Team availability for testing
- Cutover strategy (big-bang vs. phased)

---

## 4. Pricing Guidance

### Our Service Rates

| Service | Rate | Notes |
|---------|------|-------|
| **Assessment** | $2,500 - $5,000 | Fixed price based on scope |
| **Migration Planning** | $1,500 - $3,000 | Architecture & roadmap |
| **Per-Workload Migration** | $1,000 - $5,000 | Depends on complexity |
| **Post-Migration Optimization** | $1,000 - $2,500 | Cost & performance tuning |
| **Retainer (ongoing)** | $500 - $2,000/mo | Cloud management & support |

### Example Project Costs

**Small Business (5 VMs, lift & shift)**
- Assessment: $2,500
- Migration: $5,000 (5 × $1,000)
- Testing/Validation: $1,000
- **Total: ~$8,500**

**Mid-Size (25 VMs, 60% rehost, 40% replatform)**
- Assessment: $3,500
- Migration: ~$50,000 (15 × $1,000 + 10 × $3,500)
- Optimization: $2,000
- **Total: ~$55,500**

**Enterprise (75 VMs, mixed patterns)**
- Assessment: $5,000
- Migration: ~$200,000+
- Optimization: $5,000+
- **Total: ~$210,000+**

### Cloud Cost Estimation (Monthly)

| Workload | AWS Estimate | Azure Estimate |
|----------|--------------|----------------|
| Basic web server (2 vCPU, 8GB RAM) | $75-150/mo | $70-140/mo |
| Database server (4 vCPU, 16GB RAM) | $300-500/mo | $280-480/mo |
| Development environment | $50-100/mo | $45-90/mo |
| Production app (10 VMs) | $1,500-3,000/mo | $1,400-2,800/mo |

*Estimates based on on-demand pricing. Savings of 30-60% with Reserved Instances or Savings Plans.*

---

## Next Steps

1. **Initial Consultation** — Free 30-min call to discuss your environment
2. **Scope Definition** — Define migration boundaries & objectives
3. **Proposal** — Custom quote based on your specific needs
4. **Kickoff** — Begin assessment phase

---

*Document Version: 1.0 | Last Updated: 2026-03-18*
