# E-KANJOLI — BUSINESS WORKFLOW
## Version 1.2 — Updated Baseline

---

# 1. Workflow Philosophy

E-KANJOLI treats every instruction and activity as a traceable digital transaction.

General model:

```text
Instruction
   |
   v
Assignment
   |
   v
Execution
   |
   v
Progress
   |
   v
Completion
   |
   v
Verification / Approval
   |
   v
History
   |
   v
Report
```

The system must preserve the entire chain.

---

# 2. All Employees Are System Users

Every employee uses a personal account.

This includes:

```text
Kepala Badan
Sekretaris
Kepala Sub Bagian
Kepala Bidang
Fungsional
Staff
```

The account identifies the actor in every workflow.

---

# 3. Organizational Workflow

## 3.1 Kepala Badan

Can issue instructions to:

```text
Sekretaris
Kepala Bidang
```

and, when explicitly required by the workflow, other employees.

## 3.2 Sekretaris

Can receive instructions from Kepala Badan and distribute work within authorized Secretariat scope.

## 3.3 Kepala Bidang

Can receive instructions from Kepala Badan and distribute work to personnel within the authorized field.

## 3.4 Kepala Sub Bagian

Can manage work within the authorized sub-section.

## 3.5 Fungsional / Staff

Execute assigned work.

---

# 4. Task Workflow

```text
Create Task
    |
    v
Assign Employee
    |
    v
Notification
    |
    v
Acknowledged
    |
    v
In Progress
    |
    +----> Blocked
    |
    v
Submitted / Completed
    |
    v
Verification
    |
    v
Closed
```

Possible statuses:

```text
draft
assigned
acknowledged
in_progress
blocked
submitted
completed
rejected
cancelled
closed
```

Every status change is recorded.

---

# 5. Task Assignment

Task contains:

```text
issuer
assignee
unit
priority
deadline
description
source
```

The source can be:

```text
manual_instruction
incoming_letter
disposition
agenda
service
project
other
```

---

# 6. Disposition Workflow

```text
Incoming Letter
      |
      v
Registration
      |
      v
Review by authorized official
      |
      v
Disposition
      |
      v
Recipient
      |
      v
Task
      |
      v
Execution
      |
      v
Evidence / Response
      |
      v
Completion
```

The recipient cannot rewrite the original disposition.

---

# 7. Incoming Letter Workflow

```text
Receive Letter
    |
    v
Register
    |
    v
Scan / Upload
    |
    v
Classify
    |
    v
Forward / Disposition
    |
    v
Task generated
    |
    v
Monitor
    |
    v
Archive
```

Every letter can be tracked from arrival to archive.

---

# 8. Outgoing Letter Workflow

```text
Draft
  |
  v
Review
  |
  v
Correction (if needed)
  |
  v
Approval
  |
  v
Numbering
  |
  v
Signature
  |
  v
Dispatch
  |
  v
Archive
```

---

# 9. Workload Monitoring

The system calculates workload from actual activity.

Examples:

```text
total assigned tasks
completed tasks
pending tasks
overdue tasks
dispositions
letters processed
service requests
agenda activities
travel assignments
```

Reports can be viewed:

```text
per employee
per position
per unit
per month
per year
```

The workload metric must remain explainable.

No opaque AI score should become an official personnel decision without approved methodology.

---

# 10. Leadership Dashboard

Kepala Badan dashboard may include:

```text
Total active tasks
Completed tasks
Overdue tasks
Tasks by unit
Tasks by employee
Workload distribution
Incoming letters
Pending dispositions
Travel activity
Public service activity
Monthly trends
Annual trends
```

The dashboard must link summary numbers back to source records.

---

# 11. Travel Workflow

## 11.1 Proposal

Authorized users can initiate travel proposal according to permission.

## 11.2 Instruction-Based Travel

Fungsional and Staff can perform official travel when assigned by a valid authority.

Workflow:

```text
Instruction
   |
   v
Travel Assignment
   |
   v
Approval
   |
   v
Travel Order
   |
   v
Execution
   |
   v
Travel Evidence
   |
   v
Report
   |
   v
Archive
```

Important:

> Tidak boleh mengusulkan sendiri bukan berarti tidak boleh melakukan perjalanan dinas.

---

# 12. Public Service Workflow

The ten public services are handled by designated service administrators.

General pattern:

```text
Citizen submits request
       |
       v
Validation
       |
       v
Service Admin
       |
       v
Processing
       |
       v
Review / Approval if required
       |
       v
Completion
       |
       v
Citizen notification
       |
       v
Archive + report
```

Each service can have its own SLA and workflow while retaining the common platform model.

---

# 13. Service Reporting

Every service must support:

```text
daily operational data
monthly recap
annual recap
```

Metrics may include:

```text
incoming requests
completed requests
pending requests
rejected requests
processing time
SLA compliance
```

---

# 14. Document and Archive Workflow

```text
Document Created / Received
       |
       v
Classification
       |
       v
Versioning
       |
       v
Active Use
       |
       v
Finalization
       |
       v
Archive
```

Archive filters:

```text
month
year
document type
category
unit
status
```

---

# 15. Agenda Workflow

```text
Create Agenda
     |
     v
Participants
     |
     v
Notification
     |
     v
Activity
     |
     v
Attendance / Result
     |
     v
Report
```

Agenda can trigger WhatsApp group notifications.

---

# 16. Notification Workflow

Events generating notifications include:

```text
new task
new disposition
deadline reminder
overdue task
approval request
travel status
agenda
service request
letter status
```

Application notification is the primary notification.

WhatsApp is a secondary delivery channel.

---

# 17. WhatsApp BOT Workflow

## 17.1 Disposition

```text
Disposition created
       |
       +--> In-app notification
       |
       +--> WhatsApp group
```

## 17.2 Direct Task

```text
Task assigned
       |
       +--> In-app notification
       |
       +--> WhatsApp direct message
```

## 17.3 Agenda

```text
Agenda created
       |
       +--> In-app notification
       |
       +--> WhatsApp group
```

WhatsApp delivery must be logged.

If WhatsApp fails, the application record remains valid.

---

# 18. Notification Preferences

Each employee may configure allowed notification preferences where policy permits.

Examples:

```text
task
disposition
agenda
travel
service
deadline
```

Mandatory official notifications cannot be disabled if organizational policy requires delivery.

---

# 19. History and Audit

Every important workflow action creates history.

Examples:

```text
created
assigned
acknowledged
started
updated
submitted
approved
rejected
completed
cancelled
archived
```

History records:

```text
actor
timestamp
action
old state
new state
notes
```

---

# 20. Monthly Reporting

At month end, the system can generate:

```text
employee activity
employee workload
task completion
disposition completion
incoming/outgoing letters
travel
public services
agenda
documents archived
notifications
```

Reports should use transactional records and reporting views.

---

# 21. Annual Reporting

Annual reports aggregate monthly and transactional data.

Examples:

```text
annual workload
annual service performance
annual document archive
annual correspondence
annual travel
annual activity
annual task completion
```

---

# 22. Transfer / Employee Mutation Workflow

When an employee changes unit or position:

```text
Update organizational assignment
       |
       v
Update position
       |
       v
Update supervisor
       |
       v
Update permissions if required
       |
       v
Preserve historical transactions
```

Old records retain the original actor and organizational context.

---

# 23. Employee Deactivation

When employee becomes inactive:

```text
Deactivate account
       |
       v
Block new assignments
       |
       v
Preserve historical records
       |
       v
Reassign unfinished tasks
       |
       v
Record reassignment history
```

Historical ownership is never erased.

---

# 24. Workflow Governance

AI coding agents and developers MUST NOT invent new approval chains.

Any change to:

```text
authority
approval
organizational hierarchy
service ownership
travel rights
official reporting
```

must update the relevant documentation before implementation.

---

# 25. Final Workflow Principle

E-KANJOLI is not merely a document storage application.

It is an accountability system:

```text
WHO
  |
WHAT
  |
WHY
  |
WHEN
  |
TO WHOM
  |
STATUS
  |
EVIDENCE
  |
RESULT
  |
HISTORY
  |
REPORT
```

Every official digital action should be traceable to a responsible authenticated employee.
