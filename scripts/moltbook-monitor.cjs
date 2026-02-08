#!/usr/bin/env node
/**
 * Moltbook Activity Monitor
 * 监控 TiptapUI agent 的所有活动
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_ROOT = path.join(__dirname, '..');
const CONFIG_PATH = path.join(PROJECT_ROOT, '.moltbook.json');
const STATE_PATH = path.join(PROJECT_ROOT, '.moltbook-state.json');
const FEEDBACK_PATH = path.join(PROJECT_ROOT, '.moltbook-feedback.json');
const API_BASE = 'https://www.moltbook.com/api/v1';

function loadJson(path) {
  try { return JSON.parse(fs.readFileSync(path, 'utf8')); }
  catch (e) { return null; }
}

function apiRequest(endpoint, apiKey) {
  return new Promise((resolve) => {
    const url = new URL(API_BASE + endpoint);
    https.get({
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'Authorization': `Bearer ${apiKey}` }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function monitor() {
  const config = loadJson(CONFIG_PATH);
  if (!config) {
    console.log('❌ No config found');
    return;
  }

  console.log('═'.repeat(60));
  console.log('🦞 TIPTAPUI MOLTBOOK ACTIVITY MONITOR');
  console.log('═'.repeat(60));
  console.log(`📅 ${new Date().toLocaleString()}\n`);

  // 1. 账户状态
  console.log('📊 ACCOUNT STATUS');
  console.log('─'.repeat(40));
  const me = await apiRequest('/agents/me', config.api_key);
  if (me && me.success) {
    const a = me.agent;
    console.log(`   Name:     @${a.name}`);
    console.log(`   Karma:    ${a.karma} ⭐`);
    console.log(`   Posts:    ${a.stats.posts}`);
    console.log(`   Comments: ${a.stats.comments}`);
    console.log(`   Claimed:  ${a.is_claimed ? '✅ Yes' : '❌ No'}`);
    console.log(`   Profile:  https://www.moltbook.com/u/${a.name}`);
  }

  // 2. 我的帖子
  console.log('\n📝 MY RECENT POSTS');
  console.log('─'.repeat(40));
  const posts = await apiRequest('/posts?sort=new&limit=50', config.api_key);
  if (posts && posts.success) {
    const myPosts = posts.posts.filter(p => p.author.name === 'TiptapUI');
    myPosts.slice(0, 5).forEach((p, i) => {
      const date = new Date(p.created_at).toLocaleDateString();
      console.log(`   ${i+1}. "${p.title.slice(0, 40)}..."`);
      console.log(`      ⬆️ ${p.upvotes} | 💬 ${p.comment_count} | 📅 ${date}`);
      console.log(`      🔗 https://www.moltbook.com/post/${p.id}`);
    });
    if (myPosts.length === 0) console.log('   No posts yet');
  }

  // 3. 收到的评论
  console.log('\n💬 COMMENTS ON MY POSTS');
  console.log('─'.repeat(40));
  const feedback = loadJson(FEEDBACK_PATH);
  if (feedback && feedback.comments && feedback.comments.length > 0) {
    feedback.comments.slice(-5).forEach((c, i) => {
      console.log(`   ${i+1}. @${c.author}: "${c.content.slice(0, 50)}..."`);
    });
  } else {
    console.log('   No comments yet');
  }

  // 4. 机器人状态
  console.log('\n🤖 BOT STATUS');
  console.log('─'.repeat(40));
  const state = loadJson(STATE_PATH);
  if (state) {
    console.log(`   Posts sent:     ${state.postsCount || 0}`);
    console.log(`   Last post:      ${state.lastPostTime ? new Date(state.lastPostTime).toLocaleString() : 'Never'}`);
    console.log(`   Last check:     ${state.lastCheck ? new Date(state.lastCheck).toLocaleString() : 'Never'}`);

    // 冷却时间
    if (state.lastPostTime) {
      const cooldown = 30 * 60 * 1000;
      const elapsed = Date.now() - state.lastPostTime;
      if (elapsed < cooldown) {
        const remaining = Math.ceil((cooldown - elapsed) / 60000);
        console.log(`   Cooldown:       ⏳ ${remaining} min remaining`);
      } else {
        console.log(`   Cooldown:       ✅ Ready to post`);
      }
    }
  }

  // 5. 运行中的进程
  console.log('\n⚙️ RUNNING PROCESSES');
  console.log('─'.repeat(40));
  try {
    const { execSync } = require('child_process');
    const procs = execSync('pgrep -f moltbook || true', { encoding: 'utf8' }).trim();
    if (procs) {
      const pids = procs.split('\n');
      console.log(`   ${pids.length} bot process(es) running: PID ${pids.join(', ')}`);
    } else {
      console.log('   No bot processes running');
    }
  } catch (e) {
    console.log('   Could not check processes');
  }

  // 6. AI 分析
  if (feedback && feedback.analysis) {
    console.log('\n🧠 AI FEEDBACK ANALYSIS');
    console.log('─'.repeat(40));
    console.log(feedback.analysis.slice(0, 500));
    if (feedback.analysis.length > 500) console.log('   ...(truncated)');
  }

  console.log('\n' + '═'.repeat(60));
  console.log('Commands:');
  console.log('  pnpm moltbook:status      - Quick status check');
  console.log('  pnpm moltbook:feedback    - Analyze feedback');
  console.log('  tail -f moltbook-smart.log - Live logs');
  console.log('═'.repeat(60) + '\n');
}

// 持续监控模式
async function watchMode() {
  console.clear();
  await monitor();

  console.log('🔄 Auto-refreshing every 60 seconds... (Ctrl+C to stop)\n');

  setInterval(async () => {
    console.clear();
    await monitor();
    console.log('🔄 Auto-refreshing every 60 seconds... (Ctrl+C to stop)\n');
  }, 60000);
}

const command = process.argv[2];
if (command === 'watch') {
  watchMode();
} else {
  monitor();
}
