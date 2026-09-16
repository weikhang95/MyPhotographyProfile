-- Admin sessions. Only a SHA-256 hash of the session token is stored,
-- so a leaked database cannot be used to hijack a live session.
CREATE TABLE sessions (
  token_hash TEXT    PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);

-- Failed login attempts, used to rate limit password guessing per IP.
CREATE TABLE login_attempts (
  ip           TEXT    NOT NULL,
  attempted_at INTEGER NOT NULL
);

CREATE INDEX idx_login_attempts_ip_time ON login_attempts (ip, attempted_at);
