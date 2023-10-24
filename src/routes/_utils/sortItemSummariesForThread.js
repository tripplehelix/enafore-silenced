import { mark, stop } from './marks.js'

export function sortItemSummariesForThread (summaries, statusId) {
  mark('sortItemSummariesForThread')
  const summariesById = new Map()
  const summariesByParentId = new Map()
  for (const summary of summaries) {
    summary.start = false
    summary.end = false
    summariesById.set(summary.id, summary)
    if (summary.replyId) {
      if (summariesByParentId.has(summary.replyId)) {
        summariesByParentId.get(summary.replyId).push(summary)
      } else {
        summariesByParentId.set(summary.replyId, [summary])
      }
    }
  }

  const status = summariesById.get(statusId)
  if (!status) {
    // bail out, for some reason we can't find the status (should never happen)
    return summaries
  }

  const orphans = []
  for (const summary of summaries) {
    if (!summariesById.has(summary.replyId)) {
      orphans.push(summary)
    }
  }
  function treeify (summary) {
    summary.replies = (summariesByParentId.get(summary.id) || []).map(treeify.bind(summary))
    summary.parent = this
    return summary
  }
  orphans.map(treeify.bind(null))
  const ancestors = []
  let top = status
  while (top.parent) {
    top = top.parent
    top.depth = 0
    ancestors.unshift(top)
  }
  function flatten (summary) {
    summary.depth = summary.parent ? summary.parent.depth + 1 : 0
    return [summary, ...summary.replies.sort().map(flatten)].flat()
  }
  status.start = true
  status.depth = 0
  const subtree = [status, ...status.replies.map(flatten)].flat()
  subtree[subtree.length - 1].end = true
  const newSummaries = [...ancestors.map((summary, i) => {
    summary.depth = i
    return summary
  }), ...subtree, ...orphans.filter(e => e !== top).map(flatten)].flat()
  newSummaries.byId = summariesById
  stop('sortItemSummariesForThread')
  return newSummaries
}
