# Branch Protection Guide - Temuin

> **Untuk siapa**: repo owner / admin (saat ini @aidilsaputrakirsan-classroom). Anggota tim biasa tidak punya permission setting ini, tapi tetap perlu paham aturan untuk kerja sehari-hari.

> **Goal**: pastikan tidak ada perubahan masuk ke `master` tanpa review, CI hijau, dan CODEOWNERS approval.

---

## Daftar Isi

1. [Konsep Singkat](#1-konsep-singkat)
2. [Status Saat Ini](#2-status-saat-ini)
3. [Setup Branch Protection di GitHub](#3-setup-branch-protection-di-github)
4. [Required Status Checks](#4-required-status-checks)
5. [Verifikasi](#5-verifikasi)
6. [Troubleshooting](#6-troubleshooting)
7. [Referensi](#7-referensi)

---

## 1. Konsep Singkat

**Branch protection** adalah ruleset GitHub yang mengunci branch tertentu (di Temuin: `master`) supaya tidak bisa di-push langsung. Setiap perubahan harus lewat pull request dan memenuhi syarat yang sudah disepakati.

Aturan yang dipakai Temuin (sesuai `AGENTS.md` dan DEC-011, DEC-020):

- **No direct push ke `master`** — semua perubahan via PR
- **Min 1 approval review** sebelum merge
- **CODEOWNERS approval wajib** kalau file yang diubah punya owner di `.github/CODEOWNERS`
- **Required status checks**: 3 job CI (`lint`, `backend-test`, `frontend-test`) harus hijau
- **No force push** ke `master`
- **Squash merge** sebagai default merge strategy

---

## 2. Status Saat Ini

Cek status terkini via GitHub web:

- Buka https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-a-extraordinary
- Klik **Settings** (tab paling kanan, hanya muncul kalau punya admin permission)
- Sidebar kiri → **Branches** atau **Rules → Rulesets**

Yang sudah aktif sekarang (per DO-5.4 dan DO-5.5 Sprint 5):
- ✅ Ruleset `master-protection` aktif (1 approval required, block force push)
- ✅ `.github/CODEOWNERS` mengatur auto-assign reviewer

Yang perlu ditambahkan setelah PR-DO-5.1 (workflow CI) merged:
- ⬜ Required status checks: `lint`, `backend-test`, `frontend-test`

---

## 3. Setup Branch Protection di GitHub

### 3.1 Buka Settings → Rules → Rulesets

Kalau ruleset `master-protection` belum ada, klik **New ruleset** → **New branch ruleset**.

Kalau sudah ada, klik nama ruleset untuk edit.

### 3.2 Konfigurasi General

| Field                 | Value                                  | Catatan                                                                                |
| --------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| **Ruleset name**          | `master-protection`                      | Bebas, tapi nama deskriptif memudahkan debugging                                       |
| **Enforcement status**    | `Active`                                 | Kalau `Disabled`, ruleset tidak berlaku                                                |
| **Bypass list**           | (kosong)                               | Jangan tambahkan siapapun. Bypass = bypass review, defeats the purpose                 |
| **Target branches**       | `Include default branch`                 | Otomatis target `master`. Alternatif: tulis nama eksplisit `refs/heads/master` |

### 3.3 Branch rules

Centang aturan berikut:

#### Restrict deletions
- ✅ Aktif. Mencegah `git push origin --delete master` atau hapus dari UI

#### Require linear history (opsional, tergantung tim)
- ⬜ Tidak wajib. Tapi kalau aktif, semua merge harus squash atau rebase (no merge commit). Cocok untuk Temuin karena `AGENTS.md` sudah lock ke squash merge

#### Require deployments to succeed before merging
- ⬜ Skip untuk Sprint 5. Akan dipakai di Sprint 6 setelah CD pipeline ada

#### Require signed commits
- ⬜ Skip. Tidak perlu untuk project skala kelompok kuliah

#### Require a pull request before merging
- ✅ **Aktif** (paling penting)
  - **Required approvals**: `1`
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**: aktif. Approval reset kalau ada push baru
  - ✅ **Require review from Code Owners**: aktif. CODEOWNERS approval wajib untuk file yang punya owner
  - ⬜ **Require approval of the most recent reviewable push**: opsional, lebih ketat dari "stale dismiss"
  - ⬜ **Require conversation resolution before merging**: opsional, baik untuk discipline
  - **Allowed merge methods**: hanya **Squash** (sesuai `AGENTS.md`). Disable Merge dan Rebase
  - ⬜ **Automatically request Copilot code review**: opsional

#### Require status checks to pass
- ✅ **Aktif** (lihat section 4 di bawah untuk daftar status check)
- ✅ **Require branches to be up to date before merging**: aktif. Memastikan PR di-rebase ke master terbaru sebelum merge

#### Block force pushes
- ✅ **Aktif**. Mencegah `git push --force` ke master

### 3.4 Save

Klik **Save changes** di bawah halaman.

---

## 4. Required Status Checks

Setelah PR-DO-5.1 (workflow CI) merged ke master, status check akan tersedia. Tambahkan ke ruleset:

### 4.1 Tunggu CI run pertama

Pastikan workflow `ci.yml` sudah pernah jalan minimal 1× di branch manapun. Cek tab **Actions** di repo.

### 4.2 Tambah ke ruleset

Di section **Require status checks to pass**:

1. Klik **Add checks**
2. Cari satu per satu lalu pilih:
   - `Lint (ruff backend + eslint frontend)` — dari job `lint`
   - `Backend Tests (pytest + coverage)` — dari job `backend-test`
   - `Frontend Tests (vitest + build)` — dari job `frontend-test`
3. ✅ **Require branches to be up to date before merging** — tetap aktif
4. **Save changes**

### 4.3 Catatan Bootstrap-Window

Sebelum semua coverage threshold di-enforce, job `backend-test` dan `frontend-test` di workflow pakai `continue-on-error: true`. Artinya:
- Job tetap muncul di status check list
- Job yang fail ditandai kuning (warning), bukan merah, sehingga tidak block PR merge
- Setelah BE-5.4 dan FE-5.4 enhancement merged, follow-up PR akan hapus `continue-on-error`. Saat itu status check akan strict (merah → block merge)

---

## 5. Verifikasi

Test ruleset bekerja dengan skenario berikut:

### 5.1 Tes "no direct push ke master"

```bash
# Di local
git checkout master
echo "test" >> README.md
git add README.md
git commit -m "test direct push"
git push origin master
```

**Expected**:
```
remote: error: GH013: Repository rule violations found for refs/heads/master.
remote: - Cannot update this protected ref.
```

Reset:
```bash
git reset --hard origin/master
```

### 5.2 Tes "PR butuh approval"

1. Buat branch baru, ada perubahan, push, buka PR
2. Coba klik **Merge pull request** tanpa approval
3. **Expected**: tombol disabled atau ada warning "Review required"

### 5.3 Tes "CODEOWNERS auto-assign"

1. Edit file di `/backend/` (misalnya tambah komentar di `backend/app/main.py`)
2. Buka PR
3. **Expected**: @disnejy otomatis muncul di **Reviewers** sidebar

### 5.4 Tes "force push blocked"

```bash
git checkout master
git reset --hard HEAD~1
git push --force origin master
```

**Expected**:
```
remote: - Cannot force-push to this branch
```

Reset:
```bash
git pull origin master
```

---

## 6. Troubleshooting

### Error: "Required status check is not running"

**Sebab**: workflow belum pernah jalan di branch atau workflow file ada error syntax.

**Solusi**:
1. Cek tab Actions GitHub, pastikan workflow run sukses minimal 1×
2. Validate YAML lokal: `python -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml').read())"`
3. Pastikan job name persis sama dengan yang dipilih di ruleset

### Error: "Branch is out of date"

**Sebab**: PR di-buat dari master lama, sementara master sudah maju.

**Solusi**:
```bash
git checkout <feature-branch>
git fetch origin
git rebase origin/master
git push --force-with-lease origin <feature-branch>
```

### Error: "Code Owners approval required" tapi CODEOWNERS sudah benar

**Sebab**: file CODEOWNERS error format atau path tidak match pattern yang dipakai.

**Solusi**:
1. Buka PR → tab **Files changed**
2. Klik file yang bermasalah
3. Cek sidebar kanan, harus ada label "Code Owner" di samping reviewer
4. Kalau tidak ada, edit `.github/CODEOWNERS` (test pattern di GitHub UI sebelum commit)

### Bypass darurat (last resort)

Hanya admin yang bisa. Caranya: edit ruleset → set **Enforcement status** ke `Disabled` → lakukan push manual → set ulang ke `Active`. **JANGAN** dipakai untuk shortcut, hanya untuk emergency yang tidak ada jalan lain.

---

## 7. Referensi

- GitHub docs: [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- GitHub docs: [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- GitHub docs: [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- File internal: `.github/CODEOWNERS`, `.github/workflows/ci.yml`
- Sprint task: `temuin-docs/06-sprints/sprint-05.md` DO-5.3
- Decision log: `temuin-docs/01-concept/decision-log.md` DEC-011, DEC-020

---

> **Catatan**: aturan repo Temuin (sesuai `AGENTS.md`) sudah mewajibkan branch protection. Dokumen ini hanya step-by-step setup-nya. Anggota tim biasa tidak perlu setting apa-apa, cukup ikuti workflow PR yang sudah ada.
