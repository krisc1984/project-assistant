-- Create core health score tables for real DB path
CREATE TABLE IF NOT EXISTS health_scores (
  id INT PRIMARY KEY,
  value INT NOT NULL
);

CREATE TABLE IF NOT EXISTS score_logs (
  id SERIAL PRIMARY KEY,
  score_id INT REFERENCES health_scores(id) ON DELETE CASCADE,
  change TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
