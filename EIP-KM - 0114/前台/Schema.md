# 媒體資料庫管理 - Schema 設計文件

> 最後更新：2026-03-04

---

## 一、概述

本文件定義媒體資料庫管理系統的完整資料庫結構，涵蓋**三層權限控管**：

1. **空間層級權限** — 依角色設定（Admin 管理者 / Editor 編輯者 / Viewer 檢視者 / Denied 拒絕存取）
2. **資料夾層級權限** — 依角色設定（Admin 管理者 / Editor 編輯者 / Viewer 檢視者 / Denied 拒絕存取）
3. **檔案層級權限** — 依角色設定（Admin 管理者 / Editor 編輯者 / Viewer 檢視者 / Denied 拒絕存取）

權限判定規則：**檔案層級權限優先**，若檔案無獨立設定，則向上繼承資料夾權限；若資料夾無獨立設定，則向上繼承空間權限。

**資料層級架構**：
```
空間 (tblMediaSpace) → 資料夾 (tblMediaFolder) → 檔案 (tblMediaFile)
```
每個空間代表一個部門或業務單位的儲存區域，內含獨立的容量配額與管理員設定。

**命名慣例**：
- 資料表名稱以 `tbl` 開頭，例如 `tblMediaSpace`、`tblMediaFolder`
- 欄位名稱以 `c` 開頭，例如 `cMediaSpaceID`、`cFolderName`
- 主鍵使用 `int IDENTITY(1,1)` 自動遞增
- 標準稽核欄位：`cCreator`、`cCreateDT`、`cUpdator`、`cUpdateDT`
- 緩刪除欄位：`cIsDelete bit`

---

## 二、ER 關係圖

```
┌───────────────────┐     ┌─────────────────────────────┐     ┌───────────────────┐
│     tblUser       │     │   tblMediaSpacePermission         │ tblMediaSpace     │
│───────────────────│     │─────────────────────────────│     │───────────────────│
│ cUserID (PK)      │◄─┐  │ cMediaSpacePermissionID (PK)     │ ┌─►cMediaSpaceID (PK)│
│ cUserName         │  ├──│ cUserID (FK)                │    │  cSpaceName        │
│ cAccount          │  │  │ cMediaSpaceID (FK)───────────────┼──┘ cDescription    │
│ cMail             │  │  │ cRole                       │     │ cQuotaBytes       │
│ cDeptID (FK)      │  │  │ cGrantedBy                  │     │ cUsedBytes        │
│ cBuID (FK)        │  │  │ cGrantedDT                  │     │ cAdminUserID (FK) │
│ cStatus           │  │  │ cExpiresDT                  │     │ cIsDelete         │
│ cAdminStatus      │  │  │ cReason                     │     │ cCreateDT         │
│ cIsDelete         │  │  └─────────────────────────────┘     │ cUpdateDT         │
└───────────────────┘  │                                      └────────┬──────────┘
        ▲              │                                               │
        │              │  ┌─────────────────────────────┐     ┌────────┴──────────┐
        │              │  │   tblMediaFolderPermission        │  tblMediaFolder   │
        │              │  │─────────────────────────────│     │───────────────────│
        │              ├──│ cMediaFolderPermissionID (PK)     │  ┌─►│ cMediaFolderID (PK)    │
        │              │  │ cUserID (FK)                │     │ cMediaSpaceID (FK)─────┼──►tblMediaSpace
        │              │  │ cMediaFolderID (FK)──────────────┼──┘  │ cFolderName       │
        │              │  │ cRole                       │     │ cParentID (FK)    │──┐
        │              │  │ cIsInherited                │     │ cDescription      │  │
        │              │  │ cGrantedBy                  │     │ cSortOrder        │  │
        │              │  │ cGrantedDT                  │     │ cIsDelete         │  │
        │              │  │ cExpiresDT                  │     │ cCreateDT         │  │
        │              │  │ cReason                     │     └───────────────────┘  │
        │              │  └─────────────────────────────┘                            │
        │              │                                          │    ▲             │
        │              │                                          │    └─────────────┘
        │              │                                          │  (自參照：巢狀資料夾)
        │              │                                          │
        │              │  ┌─────────────────────────────┐     ┌───┴───────────────┐
        │              │  │   tblMediaFilePermission          │   tblMediaFile    │
        │              │  │─────────────────────────────│     │───────────────────│
        │              ├──│ cMediaFilePermissionID (PK)       │ cMediaFileID (PK)      │
        │              │  │ cUserID (FK)                │     │ cMediaFolderID (FK)    │
        │              │  │ cMediaFileID (FK)────────────────┼────►│ cFileName         │
        │              │  │ cRole                       │     │ cFileExtension    │
        │              │  │ cIsOverrideFolder           │     │ cMimeType         │
        │              │  │ cGrantedBy                  │     │ cFileSize         │
        │              │  │ cExpiresDT                  │     │ cFilePrivacy      │
        │              │  │ cReason                     │     │ cUploadedBy (FK)  │
        │              │  └─────────────────────────────┘     │ cVersion          │
        │              │                                      │ cDescription      │
        │              │                                      │ cIsDelete         │
        │              │                                      └───────────────────┘
        │              │
        │              │  ┌─────────────────────────────┐
        │              │  │   tblMediaAuditLog          │
        │              │  │─────────────────────────────│
        │              └──│ cMediaAuditLogID (PK)       │
        │                 │ cUserID (FK)                │
        │                 │ cAction                     │
        │                 │ cTargetType                 │
        │                 │ cTargetID                   │
        │                 │ cMediaSpaceID (FK)───────────────┼──►tblMediaSpace
        │                 │ cDetail (JSON)              │
        └─────────────────│ cIPAddress                  │
                          │ cCreateDT                   │
                          └─────────────────────────────┘
```

**關係說明**：
- `tblMediaSpace` 1:N `tblMediaFolder`（一個空間包含多個資料夾）
- `tblMediaFolder` 1:N `tblMediaFolder`（自參照，巢狀資料夾）
- `tblMediaFolder` 1:N `tblMediaFile`（一個資料夾包含多個檔案）
- `tblUser` 1:N `tblMediaSpacePermission`、`tblMediaFolderPermission`、`tblMediaFilePermission`（人員對各層級的權限）
- `tblMediaAuditLog` 透過 `cMediaSpaceID` FK 關聯至 `tblMediaSpace`，便於依空間篩選稽核紀錄
- ~~`tblMediaFileTag` 已移除~~

---

## 三、資料表定義 (SQL)

### 3.1 使用者資料表 `tblUser`

> 此為 EIP 系統共用使用者資料表，KM 模組透過 `cUserID` 關聯人員資訊。

```sql
-- =============================================
-- 使用者資料表（EIP 共用）
-- =============================================
CREATE TABLE tblUser (
    cUserID             int IDENTITY(1,1) NOT NULL,
    cUserName           nvarchar(500)   NOT NULL,
    cAccount            nvarchar(100)   NOT NULL,
    cPassword           nvarchar(500),
    cMail               nvarchar(1000)  NOT NULL,
    cIsDeptManager      bit,
    cIsDelete           bit             NOT NULL,
    cCreator            int             NOT NULL,
    cCreateDT           datetime        NOT NULL,
    cUpdator            int             NOT NULL,
    cUpdateDT           datetime        NOT NULL,
    cStatus             int             NOT NULL,
    cAdminStatus        int             NOT NULL,
    cAgentUnit          varchar(100),
    cBuID               int             NOT NULL,
    cLanguageId         int             NOT NULL,
    cDeptID             int             NOT NULL,
    cJobTitle           nvarchar(500),
    cIsMainTitle        bit,
    cIsFront            bit             NOT NULL,
    cIsChangePassword   bit,
    cPicture            nvarchar(500),
    cGoogleID           nvarchar(100),
    cOutlookID          nvarchar(100),
    cLineID             nvarchar(100),
    cSessionID          nvarchar(100),
    PRIMARY KEY (cUserID),
    CONSTRAINT FK_tblUser_tblBusinessUnit FOREIGN KEY (cBuID)
        REFERENCES tblBusinessUnit (cID),
    CONSTRAINT FK_tblUser_tblLanguage FOREIGN KEY (cLanguageId)
        REFERENCES tblLanguage (cLanguageId),
    CONSTRAINT FK_tblUser_tblDept FOREIGN KEY (cDeptID)
        REFERENCES tblDept (cDeptID)
);

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @name = N'MS_Description', @value = N'使用者';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cUserID',
    @name = N'MS_Description', @value = N'使用者編號';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cUserName',
    @name = N'MS_Description', @value = N'使用者名稱';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cAccount',
    @name = N'MS_Description', @value = N'帳號（不可重複）';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cPassword',
    @name = N'MS_Description', @value = N'密碼';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cMail',
    @name = N'MS_Description', @value = N'信箱';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cIsDeptManager',
    @name = N'MS_Description', @value = N'是否為單位最高權限(0:否, 1:是)';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cIsDelete',
    @name = N'MS_Description', @value = N'緩刪除(0:未刪除, 1:已刪除)';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cStatus',
    @name = N'MS_Description', @value = N'狀態 0:停用 1:啟用(前台狀態)';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cAdminStatus',
    @name = N'MS_Description', @value = N'狀態 0:停用 1:啟用(後臺狀態)';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cBuID',
    @name = N'MS_Description', @value = N'BU';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cDeptID',
    @name = N'MS_Description', @value = N'部門流水號';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cJobTitle',
    @name = N'MS_Description', @value = N'職稱';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblUser',
    @level2type = N'Column', @level2name = 'cIsFront',
    @name = N'MS_Description', @value = N'是否為前台';

ALTER TABLE dbo.tblUser ADD CONSTRAINT DF_tblUser_cAdminStatus DEFAULT ((0)) FOR cAdminStatus;
```

---

### 3.2 空間資料表 `tblMediaSpace`

```sql
-- =============================================
-- 空間資料表
-- 每個空間代表一個部門或業務單位的儲存區域
-- 空間內可建立資料夾與檔案，具備獨立的容量配額
-- =============================================
CREATE TABLE tblMediaSpace (
    cMediaSpaceID        int IDENTITY(1,1) NOT NULL,
    cSpaceName      nvarchar(255)   NOT NULL,
    cDescription    nvarchar(1000),
    cQuotaBytes     bigint          NOT NULL DEFAULT 10737418240,  -- 預設 10 GB
    cUsedBytes      bigint          NOT NULL DEFAULT 0,
    cAdminUserID    int             NOT NULL,
    cIsDelete       bit             NOT NULL DEFAULT 0,
    cCreator        int             NOT NULL,
    cCreateDT       datetime        NOT NULL DEFAULT GETDATE(),
    cUpdator        int             NOT NULL,
    cUpdateDT       datetime        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (cMediaSpaceID),
    CONSTRAINT FK_tblMediaSpace_tblUser_Admin FOREIGN KEY (cAdminUserID)
        REFERENCES tblUser (cUserID),
    CONSTRAINT CK_tblMediaSpace_QuotaBytes CHECK (cQuotaBytes > 0),
    CONSTRAINT CK_tblMediaSpace_UsedBytes CHECK (cUsedBytes >= 0)
);

-- 索引
CREATE INDEX IX_tblMediaSpace_cAdminUserID ON tblMediaSpace (cAdminUserID);
CREATE INDEX IX_tblMediaSpace_cIsDelete ON tblMediaSpace (cIsDelete);
CREATE UNIQUE INDEX UX_tblMediaSpace_cSpaceName ON tblMediaSpace (cSpaceName)
    WHERE cIsDelete = 0;

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpace',
    @name = N'MS_Description', @value = N'空間資料表';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpace',
    @level2type = N'Column', @level2name = 'cSpaceName',
    @name = N'MS_Description', @value = N'空間名稱（如部門名稱）';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpace',
    @level2type = N'Column', @level2name = 'cQuotaBytes',
    @name = N'MS_Description', @value = N'容量配額上限（bytes），預設 10 GB';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpace',
    @level2type = N'Column', @level2name = 'cUsedBytes',
    @name = N'MS_Description', @value = N'已使用容量（bytes），由檔案上傳/刪除時同步更新';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpace',
    @level2type = N'Column', @level2name = 'cAdminUserID',
    @name = N'MS_Description', @value = N'空間管理員（預設具有該空間全部權限）';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpace',
    @level2type = N'Column', @level2name = 'cIsDelete',
    @name = N'MS_Description', @value = N'緩刪除(0:未刪除, 1:已刪除)';
```

---

### 3.3 空間權限資料表 `tblMediaSpacePermission`

```sql
-- =============================================
-- 空間權限資料表
-- 依人員設定空間層級的角色權限
-- 角色：admin=管理者, editor=編輯者, viewer=檢視者, denied=拒絕存取
-- =============================================
CREATE TABLE tblMediaSpacePermission (
    cMediaSpacePermissionID  int IDENTITY(1,1) NOT NULL,
    cMediaSpaceID            int             NOT NULL,
    cUserID             int             NOT NULL,
    cRole               nvarchar(20)    NOT NULL DEFAULT 'viewer',
    cGrantedBy          int             NOT NULL,
    cGrantedDT          datetime        NOT NULL DEFAULT GETDATE(),
    cExpiresDT          datetime        NULL,
    cReason             nvarchar(500),
    cIsDelete           bit             NOT NULL DEFAULT 0,
    cCreator            int             NOT NULL,
    cCreateDT           datetime        NOT NULL DEFAULT GETDATE(),
    cUpdator            int             NOT NULL,
    cUpdateDT           datetime        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (cMediaSpacePermissionID),
    CONSTRAINT FK_tblMediaSpacePermission_tblMediaSpace FOREIGN KEY (cMediaSpaceID)
        REFERENCES tblMediaSpace (cMediaSpaceID) ON DELETE CASCADE,
    CONSTRAINT FK_tblMediaSpacePermission_tblUser FOREIGN KEY (cUserID)
        REFERENCES tblUser (cUserID),
    CONSTRAINT FK_tblMediaSpacePermission_tblUser_GrantedBy FOREIGN KEY (cGrantedBy)
        REFERENCES tblUser (cUserID),
    CONSTRAINT UQ_tblMediaSpacePermission_SpaceUser UNIQUE (cMediaSpaceID, cUserID),
    CONSTRAINT CK_tblMediaSpacePermission_cRole CHECK (cRole IN ('admin', 'editor', 'viewer', 'denied'))
);

-- 索引
CREATE INDEX IX_tblMediaSpacePermission_cMediaSpaceID ON tblMediaSpacePermission (cMediaSpaceID);
CREATE INDEX IX_tblMediaSpacePermission_cUserID ON tblMediaSpacePermission (cUserID);
CREATE INDEX IX_tblMediaSpacePermission_cExpiresDT ON tblMediaSpacePermission (cExpiresDT)
    WHERE cExpiresDT IS NOT NULL;

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpacePermission',
    @name = N'MS_Description', @value = N'空間權限資料表';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpacePermission',
    @level2type = N'Column', @level2name = 'cRole',
    @name = N'MS_Description', @value = N'空間角色：admin=管理者(全權限), editor=編輯者(讀寫), viewer=檢視者(唯讀), denied=拒絕存取';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpacePermission',
    @level2type = N'Column', @level2name = 'cExpiresDT',
    @name = N'MS_Description', @value = N'權限到期時間，NULL 表示永不過期';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaSpacePermission',
    @level2type = N'Column', @level2name = 'cReason',
    @name = N'MS_Description', @value = N'特殊授權或拒絕原因說明';
```

---

### 3.4 資料夾資料表 `tblMediaFolder`

```sql
-- =============================================
-- 資料夾資料表
-- 支援巢狀結構（自參照），cParentID 為 NULL 表示空間根層級
-- 每個資料夾必屬於某個空間 (cMediaSpaceID)
-- =============================================
CREATE TABLE tblMediaFolder (
    cMediaFolderID       int IDENTITY(1,1) NOT NULL,
    cMediaSpaceID        int             NOT NULL,
    cFolderName     nvarchar(255)   NOT NULL,
    cParentID       int             NULL,
    cDescription    nvarchar(1000),
    cSortOrder      int             NOT NULL DEFAULT 0,
    cIsDelete       bit             NOT NULL DEFAULT 0,
    cCreator        int             NOT NULL,
    cCreateDT       datetime        NOT NULL DEFAULT GETDATE(),
    cUpdator        int             NOT NULL,
    cUpdateDT       datetime        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (cMediaFolderID),
    CONSTRAINT FK_tblMediaFolder_tblMediaSpace FOREIGN KEY (cMediaSpaceID)
        REFERENCES tblMediaSpace (cMediaSpaceID),
    CONSTRAINT FK_tblMediaFolder_tblMediaFolder_Parent FOREIGN KEY (cParentID)
        REFERENCES tblMediaFolder (cMediaFolderID),
    CONSTRAINT FK_tblMediaFolder_tblUser_Creator FOREIGN KEY (cCreator)
        REFERENCES tblUser (cUserID)
);

-- 索引
CREATE INDEX IX_tblMediaFolder_cMediaSpaceID ON tblMediaFolder (cMediaSpaceID);
CREATE INDEX IX_tblMediaFolder_cParentID ON tblMediaFolder (cParentID);
CREATE INDEX IX_tblMediaFolder_cIsDelete ON tblMediaFolder (cIsDelete);
CREATE INDEX IX_tblMediaFolder_cFolderName ON tblMediaFolder (cFolderName);

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolder',
    @name = N'MS_Description', @value = N'資料夾資料表';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolder',
    @level2type = N'Column', @level2name = 'cMediaSpaceID',
    @name = N'MS_Description', @value = N'所屬空間 ID';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolder',
    @level2type = N'Column', @level2name = 'cParentID',
    @name = N'MS_Description', @value = N'父資料夾 ID，NULL 表示根層級';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolder',
    @level2type = N'Column', @level2name = 'cSortOrder',
    @name = N'MS_Description', @value = N'排序順序，數字越小越前面';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolder',
    @level2type = N'Column', @level2name = 'cIsDelete',
    @name = N'MS_Description', @value = N'緩刪除(0:未刪除, 1:已刪除)';
```

---

### 3.5 檔案資料表 `tblMediaFile`

```sql
-- =============================================
-- 檔案資料表
-- 儲存所有媒體檔案的元數據資訊
-- =============================================
CREATE TABLE tblMediaFile (
    cMediaFileID         int IDENTITY(1,1) NOT NULL,
    cMediaFolderID       int             NOT NULL,
    cFileName       nvarchar(500)   NOT NULL,
    cFileExtension  nvarchar(20)    NULL,
    cMimeType       nvarchar(255)   NOT NULL,
    cFileSize       bigint          NOT NULL DEFAULT 0,
    cFilePath       nvarchar(1000),
    cFilePrivacy    nvarchar(10)    NOT NULL DEFAULT N'一般',
    cUploadedBy     int             NOT NULL,
    cDescription    nvarchar(2000),
    cVersion        int             NOT NULL DEFAULT 1,
    cIsDelete       bit             NOT NULL DEFAULT 0,
    cCreator        int             NOT NULL,
    cCreateDT       datetime        NOT NULL DEFAULT GETDATE(),
    cUpdator        int             NOT NULL,
    cUpdateDT       datetime        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (cMediaFileID),
    CONSTRAINT FK_tblMediaFile_tblMediaFolder FOREIGN KEY (cMediaFolderID)
        REFERENCES tblMediaFolder (cMediaFolderID),
    CONSTRAINT FK_tblMediaFile_tblUser_UploadedBy FOREIGN KEY (cUploadedBy)
        REFERENCES tblUser (cUserID),
    CONSTRAINT CK_tblMediaFile_cFilePrivacy CHECK (cFilePrivacy IN (N'一般', N'機密')),
    CONSTRAINT CK_tblMediaFile_cFileSize CHECK (cFileSize >= 0)
);

-- 索引
CREATE INDEX IX_tblMediaFile_cMediaFolderID ON tblMediaFile (cMediaFolderID);
CREATE INDEX IX_tblMediaFile_cUploadedBy ON tblMediaFile (cUploadedBy);
CREATE INDEX IX_tblMediaFile_cFileExtension ON tblMediaFile (cFileExtension);
CREATE INDEX IX_tblMediaFile_cFilePrivacy ON tblMediaFile (cFilePrivacy);
CREATE INDEX IX_tblMediaFile_cIsDelete ON tblMediaFile (cIsDelete);
CREATE INDEX IX_tblMediaFile_cFileName ON tblMediaFile (cFileName);
CREATE INDEX IX_tblMediaFile_cCreateDT ON tblMediaFile (cCreateDT DESC);

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFile',
    @name = N'MS_Description', @value = N'檔案資料表';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFile',
    @level2type = N'Column', @level2name = 'cFileExtension',
    @name = N'MS_Description', @value = N'副檔名（如 pdf、docx、png 等）';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFile',
    @level2type = N'Column', @level2name = 'cFilePrivacy',
    @name = N'MS_Description', @value = N'檔案隱私：一般/機密';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFile',
    @level2type = N'Column', @level2name = 'cFileSize',
    @name = N'MS_Description', @value = N'檔案大小（bytes）';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFile',
    @level2type = N'Column', @level2name = 'cIsDelete',
    @name = N'MS_Description', @value = N'緩刪除(0:未刪除, 1:已刪除)';
```

---

### 3.6 資料夾權限資料表 `tblMediaFolderPermission`

> **角色對應操作權限**：
> | 角色 | 查看 | 編輯 | 上傳 | 下載 | 刪除 |
> |:---|:---:|:---:|:---:|:---:|:---:|
> | Admin 管理者 | ✓ | ✓ | ✓ | ✓ | ✓ |
> | Editor 編輯者 | ✓ | ✓ | ✓ | ✓ | × |
> | Viewer 檢視者 | ✓ | × | × | ✓ | × |
> | Denied 拒絕存取 | × | × | × | × | × |

```sql
-- =============================================
-- 資料夾權限資料表
-- 依人員設定資料夾層級的角色權限
-- 角色：admin=管理者, editor=編輯者, viewer=檢視者, denied=拒絕存取
-- =============================================
CREATE TABLE tblMediaFolderPermission (
    cMediaFolderPermissionID int IDENTITY(1,1) NOT NULL,
    cMediaFolderID           int             NOT NULL,
    cUserID             int             NOT NULL,
    cRole               nvarchar(20)    NOT NULL DEFAULT 'viewer',
    cIsInherited        bit             NOT NULL DEFAULT 0,
    cGrantedBy          int             NOT NULL,
    cGrantedDT          datetime        NOT NULL DEFAULT GETDATE(),
    cExpiresDT          datetime        NULL,
    cReason             nvarchar(500),
    cIsDelete           bit             NOT NULL DEFAULT 0,
    cCreator            int             NOT NULL,
    cCreateDT           datetime        NOT NULL DEFAULT GETDATE(),
    cUpdator            int             NOT NULL,
    cUpdateDT           datetime        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (cMediaFolderPermissionID),
    CONSTRAINT FK_tblMediaFolderPermission_tblMediaFolder FOREIGN KEY (cMediaFolderID)
        REFERENCES tblMediaFolder (cMediaFolderID) ON DELETE CASCADE,
    CONSTRAINT FK_tblMediaFolderPermission_tblUser FOREIGN KEY (cUserID)
        REFERENCES tblUser (cUserID),
    CONSTRAINT FK_tblMediaFolderPermission_tblUser_GrantedBy FOREIGN KEY (cGrantedBy)
        REFERENCES tblUser (cUserID),
    CONSTRAINT UQ_tblMediaFolderPermission_FolderUser UNIQUE (cMediaFolderID, cUserID),
    CONSTRAINT CK_tblMediaFolderPermission_cRole CHECK (cRole IN ('admin', 'editor', 'viewer', 'denied'))
);

-- 索引
CREATE INDEX IX_tblMediaFolderPermission_cMediaFolderID ON tblMediaFolderPermission (cMediaFolderID);
CREATE INDEX IX_tblMediaFolderPermission_cUserID ON tblMediaFolderPermission (cUserID);
CREATE INDEX IX_tblMediaFolderPermission_cExpiresDT ON tblMediaFolderPermission (cExpiresDT)
    WHERE cExpiresDT IS NOT NULL;

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolderPermission',
    @name = N'MS_Description', @value = N'資料夾權限資料表';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolderPermission',
    @level2type = N'Column', @level2name = 'cRole',
    @name = N'MS_Description', @value = N'資料夾角色：admin=管理者(查看/編輯/上傳/下載/刪除), editor=編輯者(查看/編輯/上傳/下載), viewer=檢視者(查看/下載), denied=拒絕存取(全部禁止)';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolderPermission',
    @level2type = N'Column', @level2name = 'cReason',
    @name = N'MS_Description', @value = N'特殊授權或拒絕原因說明';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolderPermission',
    @level2type = N'Column', @level2name = 'cIsInherited',
    @name = N'MS_Description', @value = N'是否繼承自父資料夾或空間';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFolderPermission',
    @level2type = N'Column', @level2name = 'cExpiresDT',
    @name = N'MS_Description', @value = N'權限到期時間，NULL 表示永不過期';
```

---

### 3.7 檔案權限資料表 `tblMediaFilePermission`

> **角色對應操作權限**：
> | 角色 | 查看 | 編輯 | 下載 | 刪除 |
> |:---|:---:|:---:|:---:|:---:|
> | Admin 管理者 | ✓ | ✓ | ✓ | ✓ |
> | Editor 編輯者 | ✓ | ✓ | ✓ | × |
> | Viewer 檢視者 | ✓ | × | ✓ | × |
> | Denied 拒絕存取 | × | × | × | × |

```sql
-- =============================================
-- 檔案權限資料表
-- 依人員設定檔案層級的角色權限
-- 角色：admin=管理者, editor=編輯者, viewer=檢視者, denied=拒絕存取
-- 設定 cIsOverrideFolder = 1 時，覆寫資料夾繼承的權限
-- =============================================
CREATE TABLE tblMediaFilePermission (
    cMediaFilePermissionID   int IDENTITY(1,1) NOT NULL,
    cMediaFileID             int             NOT NULL,
    cUserID             int             NOT NULL,
    cRole               nvarchar(20)    NOT NULL DEFAULT 'viewer',
    cIsOverrideFolder   bit             NOT NULL DEFAULT 1,
    cGrantedBy          int             NOT NULL,
    cGrantedDT          datetime        NOT NULL DEFAULT GETDATE(),
    cExpiresDT          datetime        NULL,
    cReason             nvarchar(500),
    cIsDelete           bit             NOT NULL DEFAULT 0,
    cCreator            int             NOT NULL,
    cCreateDT           datetime        NOT NULL DEFAULT GETDATE(),
    cUpdator            int             NOT NULL,
    cUpdateDT           datetime        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (cMediaFilePermissionID),
    CONSTRAINT FK_tblMediaFilePermission_tblMediaFile FOREIGN KEY (cMediaFileID)
        REFERENCES tblMediaFile (cMediaFileID) ON DELETE CASCADE,
    CONSTRAINT FK_tblMediaFilePermission_tblUser FOREIGN KEY (cUserID)
        REFERENCES tblUser (cUserID),
    CONSTRAINT FK_tblMediaFilePermission_tblUser_GrantedBy FOREIGN KEY (cGrantedBy)
        REFERENCES tblUser (cUserID),
    CONSTRAINT UQ_tblMediaFilePermission_FileUser UNIQUE (cMediaFileID, cUserID),
    CONSTRAINT CK_tblMediaFilePermission_cRole CHECK (cRole IN ('admin', 'editor', 'viewer', 'denied'))
);

-- 索引
CREATE INDEX IX_tblMediaFilePermission_cMediaFileID ON tblMediaFilePermission (cMediaFileID);
CREATE INDEX IX_tblMediaFilePermission_cUserID ON tblMediaFilePermission (cUserID);
CREATE INDEX IX_tblMediaFilePermission_cExpiresDT ON tblMediaFilePermission (cExpiresDT)
    WHERE cExpiresDT IS NOT NULL;

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFilePermission',
    @name = N'MS_Description', @value = N'檔案權限資料表';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFilePermission',
    @level2type = N'Column', @level2name = 'cRole',
    @name = N'MS_Description', @value = N'檔案角色：admin=管理者(查看/編輯/下載/刪除), editor=編輯者(查看/編輯/下載), viewer=檢視者(查看/下載), denied=拒絕存取(全部禁止)';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFilePermission',
    @level2type = N'Column', @level2name = 'cIsOverrideFolder',
    @name = N'MS_Description', @value = N'是否覆寫資料夾層級權限（1=覆寫, 0=合併）';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaFilePermission',
    @level2type = N'Column', @level2name = 'cReason',
    @name = N'MS_Description', @value = N'特殊授權原因說明';
```

---

### 3.8 操作稽核日誌資料表 `tblMediaAuditLog`

```sql
-- =============================================
-- 操作稽核日誌資料表
-- 記錄所有空間、資料夾、檔案、權限的操作歷程
-- =============================================
CREATE TABLE tblMediaAuditLog (
    cMediaAuditLogID     bigint IDENTITY(1,1) NOT NULL,
    cUserID         int             NOT NULL,
    cAction         nvarchar(50)    NOT NULL,
    cTargetType     nvarchar(50)    NOT NULL,
    cTargetID       int             NOT NULL,
    cMediaSpaceID        int             NULL,
    cDetail         nvarchar(MAX),
    cIPAddress      nvarchar(45),
    cUserAgent      nvarchar(500),
    cCreateDT       datetime        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (cMediaAuditLogID),
    CONSTRAINT FK_tblMediaAuditLog_tblUser FOREIGN KEY (cUserID)
        REFERENCES tblUser (cUserID),
    CONSTRAINT FK_tblMediaAuditLog_tblMediaSpace FOREIGN KEY (cMediaSpaceID)
        REFERENCES tblMediaSpace (cMediaSpaceID),
    CONSTRAINT CK_tblMediaAuditLog_cAction CHECK (
        cAction IN (
            'upload', 'edit', 'delete', 'download', 'view',
            'rename_file', 'move_file',
            'grant_permission', 'update_permission', 'revoke_permission',
            'create_folder', 'rename_folder', 'move_folder', 'delete_folder',
            'create_space', 'update_space', 'delete_space'
        )
    ),
    CONSTRAINT CK_tblMediaAuditLog_cTargetType CHECK (
        cTargetType IN ('space', 'folder', 'file', 'space_permission', 'folder_permission', 'file_permission')
    )
);

-- 索引
CREATE INDEX IX_tblMediaAuditLog_cUserID ON tblMediaAuditLog (cUserID);
CREATE INDEX IX_tblMediaAuditLog_cAction ON tblMediaAuditLog (cAction);
CREATE INDEX IX_tblMediaAuditLog_cTarget ON tblMediaAuditLog (cTargetType, cTargetID);
CREATE INDEX IX_tblMediaAuditLog_cMediaSpaceID ON tblMediaAuditLog (cMediaSpaceID);
CREATE INDEX IX_tblMediaAuditLog_cCreateDT ON tblMediaAuditLog (cCreateDT DESC);
CREATE INDEX IX_tblMediaAuditLog_UserActionDate ON tblMediaAuditLog (cUserID, cAction, cCreateDT DESC);

-- 說明
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaAuditLog',
    @name = N'MS_Description', @value = N'操作稽核日誌資料表';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaAuditLog',
    @level2type = N'Column', @level2name = 'cAction',
    @name = N'MS_Description', @value = N'操作類型：upload/edit/delete/download/view/rename_file/move_file/grant_permission/update_permission/revoke_permission/create_folder/rename_folder/move_folder/delete_folder/create_space/update_space/delete_space';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaAuditLog',
    @level2type = N'Column', @level2name = 'cTargetType',
    @name = N'MS_Description', @value = N'目標類型：space / folder / file / space_permission / folder_permission / file_permission';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaAuditLog',
    @level2type = N'Column', @level2name = 'cMediaSpaceID',
    @name = N'MS_Description', @value = N'所屬空間 ID，方便依空間篩選稽核紀錄';
EXEC sp_addextendedproperty
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table',  @level1name = 'tblMediaAuditLog',
    @level2type = N'Column', @level2name = 'cDetail',
    @name = N'MS_Description', @value = N'操作詳情（JSON 格式）';
```

---

## 四、檢視表 (View)

### 4.1 使用者有效空間權限檢視表

```sql
-- =============================================
-- 使用者有效空間權限檢視表
-- 自動排除已過期的權限紀錄與緩刪除紀錄
-- =============================================
CREATE VIEW vw_EffectiveSpacePermission
AS
SELECT
    sp.cMediaSpacePermissionID,
    sp.cMediaSpaceID,
    s.cSpaceName,
    sp.cUserID,
    u.cUserName,
    sp.cRole,
    sp.cGrantedBy,
    g.cUserName         AS cGrantedByName,
    sp.cGrantedDT,
    sp.cExpiresDT,
    sp.cReason,
    s.cQuotaBytes,
    s.cUsedBytes,
    CASE
        WHEN sp.cExpiresDT IS NULL THEN 1
        WHEN sp.cExpiresDT > GETDATE() THEN 1
        ELSE 0
    END                 AS cIsActive
FROM tblMediaSpacePermission sp
INNER JOIN tblMediaSpace s ON sp.cMediaSpaceID = s.cMediaSpaceID
INNER JOIN tblUser u ON sp.cUserID = u.cUserID
INNER JOIN tblUser g ON sp.cGrantedBy = g.cUserID
WHERE s.cIsDelete = 0
  AND sp.cIsDelete = 0
  AND u.cIsDelete = 0
  AND u.cStatus = 1;
GO
```

### 4.2 使用者有效資料夾權限檢視表

```sql
-- =============================================
-- 使用者有效資料夾權限檢視表
-- 自動排除已過期的權限紀錄，含角色展開
-- =============================================
CREATE VIEW vw_EffectiveFolderPermission
AS
SELECT
    fp.cMediaFolderPermissionID,
    fp.cMediaFolderID,
    f.cFolderName,
    f.cParentID         AS cFolderParentID,
    f.cMediaSpaceID,
    s.cSpaceName,
    fp.cUserID,
    u.cUserName,
    fp.cRole,
    -- 依角色展開操作權限（denied = 全部禁止）
    CASE WHEN fp.cRole = 'denied' THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END AS cCanView,
    CASE WHEN fp.cRole IN ('admin', 'editor') THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS cCanEdit,
    CASE WHEN fp.cRole IN ('admin', 'editor') THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS cCanUpload,
    CASE WHEN fp.cRole = 'denied' THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END AS cCanDownload,
    CASE WHEN fp.cRole = 'admin' THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS cCanDelete,
    fp.cIsInherited,
    fp.cGrantedBy,
    g.cUserName         AS cGrantedByName,
    fp.cGrantedDT,
    fp.cExpiresDT,
    fp.cReason,
    CASE
        WHEN fp.cExpiresDT IS NULL THEN 1
        WHEN fp.cExpiresDT > GETDATE() THEN 1
        ELSE 0
    END                 AS cIsActive
FROM tblMediaFolderPermission fp
INNER JOIN tblMediaFolder f ON fp.cMediaFolderID = f.cMediaFolderID
INNER JOIN tblMediaSpace s ON f.cMediaSpaceID = s.cMediaSpaceID
INNER JOIN tblUser u ON fp.cUserID = u.cUserID
INNER JOIN tblUser g ON fp.cGrantedBy = g.cUserID
WHERE f.cIsDelete = 0
  AND s.cIsDelete = 0
  AND fp.cIsDelete = 0
  AND u.cIsDelete = 0
  AND u.cStatus = 1;
GO
```

### 4.3 使用者有效檔案權限檢視表

```sql
-- =============================================
-- 使用者有效檔案權限檢視表
-- 自動排除已過期的權限紀錄，含覆寫狀態與角色展開
-- =============================================
CREATE VIEW vw_EffectiveFilePermission
AS
SELECT
    fp.cMediaFilePermissionID,
    fp.cMediaFileID,
    fl.cFileName,
    fl.cMediaFolderID,
    fo.cFolderName,
    fo.cMediaSpaceID,
    s.cSpaceName,
    fp.cUserID,
    u.cUserName,
    fp.cRole,
    -- 依角色展開操作權限（denied = 全部禁止）
    CASE WHEN fp.cRole = 'denied' THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END AS cCanView,
    CASE WHEN fp.cRole IN ('admin', 'editor') THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS cCanEdit,
    CASE WHEN fp.cRole = 'denied' THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END AS cCanDownload,
    CASE WHEN fp.cRole = 'admin' THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS cCanDelete,
    fp.cIsOverrideFolder,
    fp.cReason,
    fp.cGrantedBy,
    g.cUserName         AS cGrantedByName,
    fp.cGrantedDT,
    fp.cExpiresDT,
    CASE
        WHEN fp.cExpiresDT IS NULL THEN 1
        WHEN fp.cExpiresDT > GETDATE() THEN 1
        ELSE 0
    END                 AS cIsActive
FROM tblMediaFilePermission fp
INNER JOIN tblMediaFile fl ON fp.cMediaFileID = fl.cMediaFileID
INNER JOIN tblMediaFolder fo ON fl.cMediaFolderID = fo.cMediaFolderID
INNER JOIN tblMediaSpace s ON fo.cMediaSpaceID = s.cMediaSpaceID
INNER JOIN tblUser u ON fp.cUserID = u.cUserID
INNER JOIN tblUser g ON fp.cGrantedBy = g.cUserID
WHERE fl.cIsDelete = 0
  AND fo.cIsDelete = 0
  AND s.cIsDelete = 0
  AND fp.cIsDelete = 0
  AND u.cIsDelete = 0
  AND u.cStatus = 1;
GO
```

### 4.4 檔案完整資訊檢視表

```sql
-- =============================================
-- 檔案完整資訊檢視表
-- 彙總檔案基本資訊、所屬空間與資料夾
-- =============================================
CREATE VIEW vw_FileDetail
AS
SELECT
    f.cMediaFileID,
    f.cFileName,
    f.cFileExtension,
    f.cMimeType,
    f.cFileSize,
    f.cFilePath,
    f.cFilePrivacy,
    f.cVersion,
    f.cDescription,
    f.cMediaFolderID,
    fo.cFolderName,
    fo.cMediaSpaceID,
    s.cSpaceName,
    f.cUploadedBy,
    u.cUserName         AS cUploadedByName,
    f.cCreateDT,
    f.cUpdateDT
FROM tblMediaFile f
INNER JOIN tblMediaFolder fo ON f.cMediaFolderID = fo.cMediaFolderID
INNER JOIN tblMediaSpace s ON fo.cMediaSpaceID = s.cMediaSpaceID
INNER JOIN tblUser u ON f.cUploadedBy = u.cUserID
WHERE f.cIsDelete = 0
  AND fo.cIsDelete = 0
  AND s.cIsDelete = 0;
GO
```

---

## 五、初始資料

> 以下使用 `SET IDENTITY_INSERT ON` 指定已知 ID，方便各資料表間的 FK 參照。

```sql
-- =============================================
-- 初始資料：人員（tblUser）
-- =============================================
SET IDENTITY_INSERT tblUser ON;
INSERT INTO tblUser (cUserID, cUserName, cAccount, cPassword, cMail, cIsDeptManager, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT, cStatus, cAdminStatus, cBuID, cLanguageId, cDeptID, cIsFront) VALUES
(1, N'系統管理員', 'admin',         NULL, 'admin@company.com',            0, 0, 1, GETDATE(), 1, GETDATE(), 1, 1, 1, 1, 1, 1),
(2, N'王大明',     'daming.wang',   NULL, 'daming.wang@company.com',      1, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 2, 1),
(3, N'李小華',     'xiaohua.li',    NULL, 'xiaohua.li@company.com',       0, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 2, 1),
(4, N'張美玲',     'meiling.zhang', NULL, 'meiling.zhang@company.com',    1, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 3, 1),
(5, N'陳志偉',     'zhiwei.chen',   NULL, 'zhiwei.chen@company.com',      0, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 3, 1),
(6, N'林淑芬',     'shufen.lin',    NULL, 'shufen.lin@company.com',       1, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 4, 1),
(7, N'黃建國',     'jianguo.huang', NULL, 'jianguo.huang@company.com',    0, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 4, 1),
(8, N'吳美麗',     'meili.wu',      NULL, 'meili.wu@company.com',         1, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 5, 1),
(9, N'趙文傑',     'wenjie.zhao',   NULL, 'wenjie.zhao@company.com',      0, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 5, 1),
(10, N'周小新',    'xiaoxin.zhou',  NULL, 'xiaoxin.zhou@company.com',     0, 0, 1, GETDATE(), 1, GETDATE(), 1, 0, 1, 1, 2, 1);  -- 試用期員工
SET IDENTITY_INSERT tblUser OFF;

-- =============================================
-- 初始資料：空間（tblMediaSpace）
-- =============================================
SET IDENTITY_INSERT tblMediaSpace ON;
INSERT INTO tblMediaSpace (cMediaSpaceID, cSpaceName, cDescription, cQuotaBytes, cUsedBytes, cAdminUserID, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(1, N'BU1行銷部',   N'行銷部門媒體資料空間',     53687091200, 13743895347, 6, 0, 1, GETDATE(), 1, GETDATE()),  -- 50 GB / 已用 12.8 GB
(2, N'總務行政部',   N'總務行政部門共用空間',     21474836480, 2147483648,  1, 0, 1, GETDATE(), 1, GETDATE()),  -- 20 GB / 已用 2 GB
(3, N'人力資源部',   N'人力資源部門文件空間',     10737418240, 9556140442,  2, 0, 1, GETDATE(), 1, GETDATE()),  -- 10 GB / 已用 8.9 GB
(4, N'財務部',       N'財務部門報表與文件空間',   10737418240, 4194304,     8, 0, 1, GETDATE(), 1, GETDATE()),  -- 10 GB
(5, N'資訊技術部',   N'IT 部門技術文件空間',      10737418240, 3145728,     4, 0, 1, GETDATE(), 1, GETDATE());  -- 10 GB
SET IDENTITY_INSERT tblMediaSpace OFF;

-- =============================================
-- 初始資料：空間權限（tblMediaSpacePermission）
-- =============================================
INSERT INTO tblMediaSpacePermission (cMediaSpaceID, cUserID, cRole, cGrantedBy, cGrantedDT, cReason, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
-- BU1行銷部
(1, 6, 'admin',  1, GETDATE(), NULL, 0, 1, GETDATE(), 1, GETDATE()),
(1, 7, 'editor', 6, GETDATE(), NULL, 0, 6, GETDATE(), 6, GETDATE()),
-- 總務行政部
(2, 1, 'admin',  1, GETDATE(), NULL, 0, 1, GETDATE(), 1, GETDATE()),
-- 人力資源部
(3, 2, 'admin',  1, GETDATE(), NULL, 0, 1, GETDATE(), 1, GETDATE()),
(3, 3, 'editor', 2, GETDATE(), NULL, 0, 2, GETDATE(), 2, GETDATE()),
-- 財務部
(4, 8, 'admin',  1, GETDATE(), NULL, 0, 1, GETDATE(), 1, GETDATE()),
(4, 9, 'viewer', 8, GETDATE(), NULL, 0, 8, GETDATE(), 8, GETDATE()),
-- 資訊技術部
(5, 4, 'admin',  1, GETDATE(), NULL, 0, 1, GETDATE(), 1, GETDATE()),
(5, 5, 'editor', 4, GETDATE(), NULL, 0, 4, GETDATE(), 4, GETDATE()),
-- 試用期員工排除財務部空間
(4, 10, 'denied', 1, GETDATE(), N'試用期員工不得存取財務部空間', 0, 1, GETDATE(), 1, GETDATE());

-- =============================================
-- 初始資料：資料夾（tblMediaFolder）
-- =============================================
SET IDENTITY_INSERT tblMediaFolder ON;
INSERT INTO tblMediaFolder (cMediaFolderID, cMediaSpaceID, cFolderName, cParentID, cDescription, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(1, 3, N'公司規章', NULL, N'公司內部規章制度文件',         0, 1, GETDATE(), 1, GETDATE()),
(2, 3, N'人事辦法', 1,    N'人事相關辦法與規範',           0, 2, GETDATE(), 2, GETDATE()),
(3, 1, N'行銷素材', NULL, N'行銷部門設計素材與媒體檔案',   0, 6, GETDATE(), 6, GETDATE()),
(4, 1, N'社群媒體', 3,    N'社群平台發佈用素材',           0, 7, GETDATE(), 7, GETDATE()),
(5, 4, N'財務報表', NULL, N'各期財務報表與分析',           0, 8, GETDATE(), 8, GETDATE()),
(6, 5, N'技術文件', NULL, N'IT 部門技術文件與系統文件',    0, 4, GETDATE(), 4, GETDATE());
SET IDENTITY_INSERT tblMediaFolder OFF;

-- =============================================
-- 初始資料：檔案（tblMediaFile）
-- =============================================
SET IDENTITY_INSERT tblMediaFile ON;
INSERT INTO tblMediaFile (cMediaFileID, cMediaFolderID, cFileName, cFileExtension, cMimeType, cFileSize, cFilePrivacy, cUploadedBy, cVersion, cDescription, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(1, 1, N'員工手冊_2025.pdf',        'pdf',  'application/pdf',  5242880,  N'一般', 2, 3, N'2025 年度員工手冊',             0, 2, GETDATE(), 2, GETDATE()),
(2, 1, N'資訊安全政策.pdf',          'pdf',  'application/pdf',  2097152,  N'機密', 4, 2, N'公司資訊安全政策文件',           0, 4, GETDATE(), 4, GETDATE()),
(3, 2, N'請假辦法.docx',            'docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1048576, N'一般', 2, 4, N'員工請假辦法與流程', 0, 2, GETDATE(), 2, GETDATE()),
(4, 3, N'品牌主視覺.png',           'png',  'image/png',         8388608,  N'一般', 6, 5, N'2025 年度品牌主視覺設計稿',     0, 6, GETDATE(), 6, GETDATE()),
(5, 4, N'春節廣告_30s.mp4',         'mp4',  'video/mp4',         52428800, N'一般', 7, 1, N'春節檔期 30 秒廣告影片',         0, 7, GETDATE(), 7, GETDATE()),
(6, 4, N'IG貼文素材_0301.jpg',      'jpg',  'image/jpeg',        3145728,  N'一般', 7, 1, N'Instagram 貼文用素材',           0, 7, GETDATE(), 7, GETDATE()),
(7, 5, N'Q3財務報表.xlsx',          'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 4194304, N'機密', 8, 2, N'第三季財務報表', 0, 8, GETDATE(), 8, GETDATE()),
(8, 6, N'API技術文件_v2.md',        'md',   'text/markdown',     524288,   N'一般', 4, 8, N'REST API 技術文件第二版',        0, 4, GETDATE(), 4, GETDATE()),
(9, 6, N'系統架構圖.png',           'png',  'image/png',         2621440,  N'一般', 5, 3, N'EIP-KM 系統架構圖',             0, 5, GETDATE(), 5, GETDATE());
SET IDENTITY_INSERT tblMediaFile OFF;

-- =============================================
-- 初始資料：資料夾權限（tblMediaFolderPermission）
-- 角色：admin=管理者, editor=編輯者, viewer=檢視者
-- =============================================
-- 公司規章 (cMediaFolderID=1)
INSERT INTO tblMediaFolderPermission (cMediaFolderID, cUserID, cRole, cIsInherited, cGrantedBy, cGrantedDT, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(1, 1, 'admin',  0, 1, GETDATE(), 0, 1, GETDATE(), 1, GETDATE()),
(1, 2, 'editor', 0, 1, GETDATE(), 0, 1, GETDATE(), 1, GETDATE()),
(1, 3, 'viewer', 0, 2, GETDATE(), 0, 2, GETDATE(), 2, GETDATE()),
(1, 4, 'viewer', 0, 1, GETDATE(), 0, 1, GETDATE(), 1, GETDATE());

-- 人事辦法 (cMediaFolderID=2)
INSERT INTO tblMediaFolderPermission (cMediaFolderID, cUserID, cRole, cIsInherited, cGrantedBy, cGrantedDT, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(2, 2, 'admin',  0, 1, GETDATE(), 0, 1, GETDATE(), 1, GETDATE()),
(2, 3, 'editor', 0, 2, GETDATE(), 0, 2, GETDATE(), 2, GETDATE());

-- 行銷素材 (cMediaFolderID=3)
INSERT INTO tblMediaFolderPermission (cMediaFolderID, cUserID, cRole, cIsInherited, cGrantedBy, cGrantedDT, cExpiresDT, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(3, 6, 'admin',  0, 1, GETDATE(), NULL,                   0, 1, GETDATE(), 1, GETDATE()),
(3, 7, 'editor', 0, 6, GETDATE(), NULL,                   0, 6, GETDATE(), 6, GETDATE()),
(3, 2, 'viewer', 0, 1, GETDATE(), '2026-03-05 10:00:00',  0, 1, GETDATE(), 1, GETDATE());

-- 社群媒體 (cMediaFolderID=4)
INSERT INTO tblMediaFolderPermission (cMediaFolderID, cUserID, cRole, cIsInherited, cGrantedBy, cGrantedDT, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(4, 6, 'admin',  1, 1, GETDATE(), 0, 1, GETDATE(), 1, GETDATE()),
(4, 7, 'admin',  0, 6, GETDATE(), 0, 6, GETDATE(), 6, GETDATE());

-- 財務報表 (cMediaFolderID=5)
INSERT INTO tblMediaFolderPermission (cMediaFolderID, cUserID, cRole, cIsInherited, cGrantedBy, cGrantedDT, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(5, 8, 'admin',  0, 1, GETDATE(), 0, 1, GETDATE(), 1, GETDATE()),
(5, 9, 'viewer', 0, 8, GETDATE(), 0, 8, GETDATE(), 8, GETDATE());

-- 技術文件 (cMediaFolderID=6)
INSERT INTO tblMediaFolderPermission (cMediaFolderID, cUserID, cRole, cIsInherited, cGrantedBy, cGrantedDT, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(6, 4, 'admin',  0, 1, GETDATE(), 0, 1, GETDATE(), 1, GETDATE()),
(6, 5, 'editor', 0, 4, GETDATE(), 0, 4, GETDATE(), 4, GETDATE());

-- 試用期員工排除特定資料夾（denied 範例）
INSERT INTO tblMediaFolderPermission (cMediaFolderID, cUserID, cRole, cIsInherited, cGrantedBy, cGrantedDT, cReason, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(1, 10, 'denied', 0, 1, GETDATE(), N'試用期員工不得查看公司規章', 0, 1, GETDATE(), 1, GETDATE()),
(5, 10, 'denied', 0, 1, GETDATE(), N'試用期員工不得查看財務報表', 0, 1, GETDATE(), 1, GETDATE());

-- =============================================
-- 初始資料：檔案權限（tblMediaFilePermission）
-- 覆寫資料夾權限的特殊設定
-- =============================================
INSERT INTO tblMediaFilePermission (cMediaFileID, cUserID, cRole, cIsOverrideFolder, cGrantedBy, cGrantedDT, cReason, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(1, 4, 'editor', 1, 1, GETDATE(), N'資安政策需 IT 部門協同編輯',  0, 1, GETDATE(), 1, GETDATE()),
(2, 3, 'viewer', 1, 1, GETDATE(), N'機密文件僅允查看',            0, 1, GETDATE(), 1, GETDATE());

INSERT INTO tblMediaFilePermission (cMediaFileID, cUserID, cRole, cIsOverrideFolder, cGrantedBy, cGrantedDT, cExpiresDT, cReason, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(7, 2, 'viewer', 1, 8, GETDATE(), '2026-01-20 14:00:00', N'跨部門年度審查需查閱', 0, 8, GETDATE(), 8, GETDATE());

INSERT INTO tblMediaFilePermission (cMediaFileID, cUserID, cRole, cIsOverrideFolder, cGrantedBy, cGrantedDT, cReason, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(7, 9, 'editor', 1, 8, GETDATE(), N'財務專員需協助編輯報表',      0, 8, GETDATE(), 8, GETDATE()),
(8, 5, 'editor', 1, 4, GETDATE(), N'技術文件刪除權限僅限主管',    0, 4, GETDATE(), 4, GETDATE());

INSERT INTO tblMediaFilePermission (cMediaFileID, cUserID, cRole, cIsOverrideFolder, cGrantedBy, cGrantedDT, cExpiresDT, cReason, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(5, 2, 'viewer', 1, 6, GETDATE(), '2025-03-01 00:00:00', N'HR 需下載用於內部宣傳', 0, 6, GETDATE(), 6, GETDATE());

-- 試用期員工排除特定檔案（denied 範例）
INSERT INTO tblMediaFilePermission (cMediaFileID, cUserID, cRole, cIsOverrideFolder, cGrantedBy, cGrantedDT, cReason, cIsDelete, cCreator, cCreateDT, cUpdator, cUpdateDT) VALUES
(2, 10, 'denied', 1, 1, GETDATE(), N'試用期員工不得查看資安政策', 0, 1, GETDATE(), 1, GETDATE());
```

---

## 六、權限繼承對照表

三層權限繼承邏輯（空間 → 資料夾 → 檔案）：

| 繼承來源 | 角色 | 資料夾操作權限 | 檔案操作權限 |
|:---|:---|:---|:---|
| 空間 → 資料夾 | Admin | 查看/編輯/上傳/下載/刪除 | 查看/編輯/下載/刪除 |
| 空間 → 資料夾 | Editor | 查看/編輯/上傳/下載 | 查看/編輯/下載 |
| 空間 → 資料夾 | Viewer | 查看/下載 | 查看/下載 |
| 空間 → 資料夾 | **Denied** | **全部禁止** | **全部禁止** |
| 資料夾 → 檔案 | Admin | — | 查看/編輯/下載/刪除 |
| 資料夾 → 檔案 | Editor | — | 查看/編輯/下載 |
| 資料夾 → 檔案 | Viewer | — | 查看/下載 |
| 資料夾 → 檔案 | **Denied** | — | **全部禁止** |

> **注意**：若檔案設有獨立權限（`tblMediaFilePermission` 中存在記錄且 `cIsOverrideFolder = 1`），則**完全採用檔案權限角色**，不再參考資料夾或空間權限。

---

## 七、權限判定流程

```
使用者請求存取檔案
        │
        ▼
  是否為後台管理員？ ──── 是 ──→ 授予所有權限 ✅
 （cAdminStatus=1）
        │ 否
        ▼
  檔案是否有獨立角色？ ── 是 ──→ 角色 = denied？
 （tblMediaFilePermission）         │ 否        │ 是
        │ 否                    ▼           ▼
        ▼             權限是否過期？   拒絕存取 ❌
  查找所屬資料夾角色         │ 否     │ 是
 （tblMediaFolderPermission）       ▼        ▼
        │              依檔案角色  繼續往下 ↓
        ▼              展開權限 ✅     │
  資料夾有直接角色？ ──── 是 ──→ 角色 = denied？
        │ 否                       │ 否     │ 是
        ▼                         ▼       ▼
  父資料夾有角色？ ────── 是 ──→ 是否過期？  拒絕存取 ❌
  （遞迴向上查找）                │ 否
        │ 否                     ▼
        ▼               依資料夾角色
  查找所屬空間角色    展開檔案權限 ✅
 （tblMediaSpacePermission）
        │
        ▼
  空間有角色？ ──────── 是 ──→ 角色 = denied？
        │ 否                    │ 否     │ 是
        ▼                       ▼       ▼
    拒絕存取 ❌          依空間角色  拒絕存取 ❌
                          展開檔案權限 ✅
```

> **角色展開規則**：
> - **Admin**：查看 ✓ 編輯 ✓ 下載 ✓ 刪除 ✓（資料夾另加上傳 ✓）
> - **Editor**：查看 ✓ 編輯 ✓ 下載 ✓（資料夾另加上傳 ✓）
> - **Viewer**：查看 ✓ 下載 ✓
> - **Denied**：全部禁止 ❌（適用於試用期員工、即將離職人員等排除情境）

---

## 八、索引策略說明

| 資料表 | 索引 | 用途 |
|:---|:---|:---|
| `tblUser` | PK `cUserID` | 使用者主鍵查詢 |
| `tblMediaSpace` | `UX_tblMediaSpace_cSpaceName` | 確保空間名稱唯一 |
| `tblMediaSpace` | `IX_tblMediaSpace_cAdminUserID` | 依管理員查詢空間 |
| `tblMediaSpacePermission` | `UQ_tblMediaSpacePermission_SpaceUser` | 確保每人每空間僅一筆權限 |
| `tblMediaFolder` | `IX_tblMediaFolder_cParentID` | 建構資料夾樹狀結構 |
| `tblMediaFolder` | `IX_tblMediaFolder_cMediaSpaceID` | 依空間查詢資料夾 |
| `tblMediaFile` | `IX_tblMediaFile_cMediaFolderID` | 依資料夾查詢檔案清單 |
| `tblMediaFile` | `IX_tblMediaFile_cCreateDT` | 依上傳時間排序 |
| `tblMediaFolderPermission` | `UQ_tblMediaFolderPermission_FolderUser` | 確保每人每資料夾僅一筆權限 |
| `tblMediaFilePermission` | `UQ_tblMediaFilePermission_FileUser` | 確保每人每檔案僅一筆權限 |
| `tblMediaAuditLog` | `IX_tblMediaAuditLog_UserActionDate` | 查詢特定人員的操作紀錄 |
| `tblMediaAuditLog` | `IX_tblMediaAuditLog_cTarget` | 查詢特定目標的操作歷程 |
| `tblMediaAuditLog` | `IX_tblMediaAuditLog_cMediaSpaceID` | 依空間篩選稽核紀錄 |
