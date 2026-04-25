<div align="center">
  <img src="./public/headerlogo.png" alt="pvtcldstrg logo" width="180" />

  <h1>pvtcldstrg</h1>

  <p><strong>A real cloud storage platform — where your files never touch my server.</strong></p>

  <p>
    Not a tutorial clone. Not a Firebase wrapper. A from-scratch reverse-engineering of the architecture behind Dropbox and Google Drive — built by a student to actually understand how the real thing works.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/AWS%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white" alt="AWS S3" />
    <img src="https://img.shields.io/badge/PostgreSQL-NeonDB-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL / NeonDB" />
    <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
    <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </p>

  <p>
    <a href="https://cloudkinshuk.in"><strong>Creator »</strong></a> ·
    <a href="https://cloudkinshuk.in/home-blog/blogG"><strong>How I built this »</strong></a> ·
    <a href="https://clkfeedbacks.cloudkinshuk.in"><strong>Leave feedback »</strong></a>
  </p>
</div>

---

## The problem with most "cloud storage" tutorials

Every cloud storage tutorial online stores files on the server, drops them in a folder, and calls it done. That breaks the moment two users sign up.

I wanted to understand how the *real* thing works — the architecture serving billions of files without melting. So I built it properly.

## How it actually works

When a user uploads a file, **the server never sees a single byte**. Here's the flow:

```text
┌──────────┐   1. "Can I upload?"     ┌──────────┐
│  Browser │ ───────────────────────► │  Server  │
└──────────┘                          └────┬─────┘
                                           │ checks identity, quota, plan tier
                                           │ generates 60s presigned URL
┌──────────┐   2. presigned S3 URL    ┌────▼─────┐
│  Browser │ ◄─────────────────────── │  Server  │
└────┬─────┘                          └──────────┘
     │ 3. PUT file directly to S3
     ▼
┌──────────┐
│  AWS S3  │
└────┬─────┘
     │ 4. confirms delivery
     ▼
┌──────────┐   5. verify + record     ┌──────────┐
│  Server  │ ───────────────────────► │ Postgres │
└──────────┘    (atomic transaction)  └──────────┘
```

The server's job is just to be the **gatekeeper and bookkeeper** — never the pipe. That's the same pattern Google Drive and Dropbox use.

## Highlights

- **Zero-touch uploads** — files travel browser → S3 directly via presigned URLs that self-destruct in 60 seconds.
- **Quota enforcement** — per-user storage and file-count limits are checked *before* the presigned URL is issued, not after the upload.
- **Plan tiers via reference table** — limits live in a `plans` table, not hardcoded per-row. Migrating tiers means one row change, not a backfill.
- **Atomic storage accounting** — verification, file record insert, and storage-counter update happen in a single PostgreSQL transaction. No drift.
- **Orphaned-file cleanup** — when a user deletes their account, a Clerk webhook purges every S3 object under their prefix *before* the database cascade fires. Order matters: delete the references first and you've lost the map to the files.
- **Search** — fuzzy client-side search over file metadata via Fuse.js.

## Tech stack

| Layer            | Choice                                        |
| ---------------- | --------------------------------------------- |
| Framework        | Next.js 16 (App Router) + React 19            |
| Language         | TypeScript                                    |
| Auth & webhooks  | Clerk + Svix                                  |
| Storage          | AWS S3 (presigned PUT)                        |
| Database         | NeonDB (serverless PostgreSQL)                |
| Styling          | Tailwind CSS v4                               |
| Animation        | Framer Motion                                 |
| Search           | Fuse.js                                       |

## Getting started

### Prerequisites

- Node.js 20+
- An AWS account with an S3 bucket and an IAM user with `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions
- A NeonDB (or any PostgreSQL) database
- A Clerk application

### Installation

```bash
git clone https://github.com/<your-username>/pvtcldstrg.git
cd pvtcldstrg
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=your-bucket-name
```

### S3 bucket CORS

Your bucket needs to allow direct browser uploads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Wire up the Clerk webhook

Point your Clerk dashboard's webhook to `https://your-domain.com/api/webhooks/clerk` and subscribe to at least `user.created` and `user.deleted`. The deletion handler is what keeps S3 from filling with ghost files.

## Project scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## A note on AI

I used AI heavily building this — specifically Claude. But not the way people assume. I didn't paste *"build me a Google Drive"* and copy the output. That doesn't work for something like this.

I'd hit a wall — understanding presigned URLs, or chasing down why my storage counter was drifting — and dump my actual code into the conversation asking *"what's wrong here?"* It would spot the architectural flaw I was too close to see. The migration from hardcoded limits to a `plans` reference table came from a conversation where I explained my problem and got walked through *why* a reference table beats per-row limits. The orphaned-files fix was the same — I described the symptom, got the root cause back.

**AI didn't build this. I did.** AI was the senior engineer I didn't have access to — available at 2 AM when I was stuck, patient enough to explain concepts three different ways, honest enough to say my first approach was bad.

If you're a student thinking about building: stop watching tutorials. Pick a real product, figure out *why* it works the way it does, and rebuild it. Use AI as a thinking partner, not a vending machine. That's where the learning lives.

I wrote up the full journey here → [**How I built this**](https://cloudkinshuk.in/home-blog/blogG)

## Connect

<div>
  <a href="https://cloudkinshuk.in">
    <img src="https://img.shields.io/badge/Portfolio-cloudkinshuk.in-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
  </a>
  <a href="https://cloudkinshuk.in/home-blog">
    <img src="https://img.shields.io/badge/Blog-Read%20more-FF6B35?style=for-the-badge&logo=hashnode&logoColor=white" alt="Blog" />
  </a>
  <a href="https://twitter.com/realkinshuk004">
    <img src="https://img.shields.io/badge/Twitter-@realkinshuk004-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />
  </a>
  <a href="mailto:kinshuk25jan04@gmail.com">
    <img src="https://img.shields.io/badge/Email-kinshuk25jan04@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
  <a href="https://clkfeedbacks.cloudkinshuk.in">
    <img src="https://img.shields.io/badge/Feedback-Leave%20one-22C55E?style=for-the-badge&logo=googleforms&logoColor=white" alt="Feedback" />
  </a>
</div>

## License

MIT — do whatever, just don't sell it as your own.

---

<div align="center">
  <sub>Built by <a href="https://cloudkinshuk.in"><strong>Kinshuk Jain</strong></a> · The app is live. The code is real. I understand every line because I fought for each one.</sub>
</div>
