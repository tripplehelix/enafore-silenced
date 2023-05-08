import { pickBy, get } from '../../_utils/lodash-lite.js'
import { getFirstIdFromItemSummaries } from '../../_utils/getIdFromItemSummaries.js'

function reorder(timelineName, summaries) {
  const backupSummaries = summaries
  try {
    if (!timelineName.startsWith("status/")) {
      return summaries
    }
    const quoteRenotes = summaries.filter(e => e.quoteId)
    summaries = summaries.filter(e => !e.quoteId)
    const replyChildren = {}
    for (let summary of summaries) {
      if (summary.replyId) {
        replyChildren[summary.replyId] = replyChildren[summary.replyId] || []
        replyChildren[summary.replyId].push(summary)
      }
    }
    function flatten(summary, level = 0) {
      console.debug({summary, replyChildren, summaries})
      return [{ ...summary, level }, ...(replyChildren[summary.id] || []).map(e => flatten(e, level + 1))].flat()
    }
    const reordered = flatten(summaries[0])
    const reorderedIds = new Set(reordered.map(e => e.id))
    for (let summary of summaries) {
      if (!reorderedIds.has(summary.id)) {
        throw Object.assign(new Error("reorder missing status"), { summary, summaries, reordered, timelineName, replyChildren })
      }
    }
    return [...reordered, ...quoteRenotes]
  } catch (e) {
    console.error(e)
    return backupSummaries
  }
}

export function timelineMixins(Store) {
  Store.prototype.setForTimeline = function (instanceName, timelineName, obj) {
    const valuesToSet = {}
    for (const key of Object.keys(obj)) {
      if (key === "timelineItemSummaries") {
        obj[key] = reorder(timelineName, obj[key])
      }
      const rootKey = `timelineData_${key}`
      const root = this.get()[rootKey] || {}
      const instanceData = root[instanceName] = root[instanceName] || {}
      instanceData[timelineName] = obj[key]
      valuesToSet[rootKey] = root
    }

    this.set(valuesToSet)
  }

  Store.prototype.getForTimeline = function (instanceName, timelineName, key) {
    const rootKey = `timelineData_${key}`
    const root = this.get()[rootKey]
    return get(root, [instanceName, timelineName])
  }

  Store.prototype.getAllTimelineData = function (instanceName, key) {
    const root = this.get()[`timelineData_${key}`] || {}
    return root[instanceName] || {}
  }

  Store.prototype.getFirstTimelineItemId = function (instanceName, timelineName) {
    const summaries = this.getForTimeline(instanceName, timelineName, 'timelineItemSummaries')
    return getFirstIdFromItemSummaries(summaries)
  }

  Store.prototype.setForCurrentTimeline = function (obj) {
    const { currentInstance, currentTimeline } = this.get()
    this.setForTimeline(currentInstance, currentTimeline, obj)
  }

  Store.prototype.getThreads = function (instanceName) {
    const instanceData = this.getAllTimelineData(instanceName, 'timelineItemSummaries')

    return pickBy(instanceData, (value, key) => {
      return key.startsWith('status/')
    })
  }

  Store.prototype.clearTimelineDataForInstance = function (instanceName) {
    const changes = {}
    Object.entries(this.get()).forEach(([key, value]) => {
      if (key.startsWith('timelineData_') && value) {
        delete value[instanceName]
        changes[key] = value
      }
    })
    this.set(changes)
  }
}
