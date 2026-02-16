-- Migration: create scores and score_logs tables
CREATE TABLE IF NOT EXISTS project_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  checkpoint_id INT NOT NULL,
  original_score INT NOT NULL,
  deducted_score INT DEFAULT 0,
  final_score INT NOT NULL,
  scored_by INT,
  scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS score_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  checkpoint_id INT NULL,
  score_id INT NULL,
  action VARCHAR(50) NOT NULL,
  old_score INT,
  new_score INT,
  reason TEXT,
  operated_by INT,
  operated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (score_id) REFERENCES project_scores(id)
);
 
