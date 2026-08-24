
const EXPLORE_LOG_KEY = "wtm_exploration_log_v1";
 
function loadExploreLog() {
  try {
    return JSON.parse(localStorage.getItem(EXPLORE_LOG_KEY)) || [];
  } catch (e) {
    return [];
  }
}
 
function addExploreLogEntry(entry) {
  const log = loadExploreLog();
  log.unshift(entry); // เอาอันใหม่ไว้บนสุด
  localStorage.setItem(EXPLORE_LOG_KEY, JSON.stringify(log));
}