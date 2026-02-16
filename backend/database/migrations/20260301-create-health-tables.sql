-- Create core health score tables for MySQL path
CREATE TABLE IF NOT EXISTS health_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value INT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS score_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  score_id INT,
  `change` TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_health_score FOREIGN KEY (score_id) REFERENCES health_scores(id) ON DELETE CASCADE
) ENGINE=InnoDB;
