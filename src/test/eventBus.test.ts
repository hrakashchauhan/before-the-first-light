import { describe, it, expect, vi, beforeEach } from 'vitest'
import { eventBus } from '../systems/events/eventBus'

describe('Typed Event Bus Subsystem', () => {
  beforeEach(() => {
    eventBus.clear()
  })

  it('subscribes and receives typed event payload', () => {
    const handler = vi.fn()
    eventBus.on('quest:completed', handler)

    eventBus.emit('quest:completed', { questId: 'q_courtyard_clean' })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith({ questId: 'q_courtyard_clean' })
  })

  it('unsubscribes cleanly via returned callback', () => {
    const handler = vi.fn()
    const unsubscribe = eventBus.on('world:state-changed', handler)

    eventBus.emit('world:state-changed', { flag: 'courtyard_cleaned', value: true })
    expect(handler).toHaveBeenCalledTimes(1)

    unsubscribe()
    eventBus.emit('world:state-changed', { flag: 'wheat_sorted', value: true })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('isolates listener errors without preventing other handlers from firing', () => {
    const faultyHandler = vi.fn(() => {
      throw new Error('Test failure simulation in listener')
    })
    const reliableHandler = vi.fn()

    const spyConsole = vi.spyOn(console, 'error').mockImplementation(() => {})

    eventBus.on('player:interact', faultyHandler)
    eventBus.on('player:interact', reliableHandler)

    eventBus.emit('player:interact', { targetId: 'npc_mother' })

    expect(faultyHandler).toHaveBeenCalledTimes(1)
    expect(reliableHandler).toHaveBeenCalledTimes(1)
    expect(spyConsole).toHaveBeenCalled()

    spyConsole.mockRestore()
  })

  it('supports multiple listeners for the same event key', () => {
    const h1 = vi.fn()
    const h2 = vi.fn()

    eventBus.on('timeline:phase-changed', h1)
    eventBus.on('timeline:phase-changed', h2)

    eventBus.emit('timeline:phase-changed', { timeOfDay: 'sunrise' })

    expect(h1).toHaveBeenCalledWith({ timeOfDay: 'sunrise' })
    expect(h2).toHaveBeenCalledWith({ timeOfDay: 'sunrise' })
  })
})
