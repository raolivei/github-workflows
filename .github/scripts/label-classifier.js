/**
 * Reusable label classifier for raolivei org repos
 * Used by auto-label.yml reusable workflow
 */

const fs = require('fs');
const yaml = require('js-yaml');

function matchesPattern(text, patterns) {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(text);
  });
}

function classify(title, body, config) {
  const labels = new Set();
  const combined = `${title} ${body}`.toLowerCase();

  // Type rules (bug, enhancement, docs, etc.)
  if (config.type_rules) {
    for (const [label, rule] of Object.entries(config.type_rules)) {
      if (matchesPattern(title, rule.title_patterns) ||
          matchesPattern(body, rule.body_patterns)) {
        labels.add(label);
      }
    }
  }

  // Priority rules (P0-P3)
  if (config.priority_rules) {
    for (const [label, rule] of Object.entries(config.priority_rules)) {
      if (matchesPattern(combined, rule.patterns)) {
        labels.add(label);
      }
    }
  }

  // Area rules (backend, frontend, etc.)
  if (config.area_rules) {
    for (const [label, rule] of Object.entries(config.area_rules)) {
      if (matchesPattern(combined, rule.patterns)) {
        labels.add(label);
      }
    }
  }

  // Project rules (monarch-parity, etc.)
  if (config.project_rules) {
    for (const [label, rule] of Object.entries(config.project_rules)) {
      if (matchesPattern(combined, rule.patterns)) {
        labels.add(label);
      }
    }
  }

  return Array.from(labels);
}

module.exports = { classify, matchesPattern };

// CLI usage
if (require.main === module) {
  const [configPath, title, body] = process.argv.slice(2);

  if (!configPath || !title) {
    console.error('Usage: node label-classifier.js <config.yml> <title> [body]');
    process.exit(1);
  }

  const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
  const labels = classify(title, body || '', config);

  console.log(JSON.stringify({ labels }));
}
