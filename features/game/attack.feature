Feature: As a player I attack and defend in real time

  Background:
    Given I use seed data

  Scenario: The attacker attacks, the defender defends, and the turn flips
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    And player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 2.0, "attackingCharacter": "SUNNY", "attackedCharacter": "VEGA" }
      """
    Then player "01HRESEED0000000000000P201" receives "attacked" with:
      """
      { "attackingPlayerId": "01HRESEED0000000000000P201" }
      """
    And player "01HRESEED0000000000000P202" receives "attacked" with:
      """
      { "attackingPlayerId": "01HRESEED0000000000000P201" }
      """
    And player "01HRESEED0000000000000P202" receives "charactersUpdated" with:
      """
      [
        {
          "type": "IRIS",
          "superpower": "LIGHT",
          "stats": { "intelligence": 9, "defense": 4, "power": 4, "health": 6 },
          "isDead": false
        },
        {
          "type": "SKYE",
          "superpower": "AIR",
          "stats": { "intelligence": 4, "defense": 4, "power": 7, "health": 7 },
          "isDead": false
        },
        {
          "type": "SUNNY",
          "superpower": "FIRE",
          "stats": { "intelligence": 3, "defense": 4, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "THORA",
          "superpower": "ELECTRIC",
          "stats": { "intelligence": 5, "defense": 3, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "VEGA",
          "superpower": "GRASS",
          "stats": { "intelligence": 8, "defense": 3, "power": 6, "health": 8 },
          "isDead": false
        }
      ]
      """
    When player "01HRESEED0000000000000P202" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 1.0 }
      """
    Then player "01HRESEED0000000000000P201" receives "turnChanged" with:
      """
      {
        "id": "01HRESEED000000000000000S2",
        "state": "READY",
        "firstPlayerId": "01HRESEED0000000000000P201",
        "secondPlayerId": "01HRESEED0000000000000P202",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P202",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """
    And player "01HRESEED0000000000000P202" receives "turnChanged" with:
      """
      {
        "id": "01HRESEED000000000000000S2",
        "state": "READY",
        "firstPlayerId": "01HRESEED0000000000000P201",
        "secondPlayerId": "01HRESEED0000000000000P202",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P202",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """
    When I send a "GET" request to "/api/v1/sessions/01HRESEED000000000000000S2"
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "01HRESEED000000000000000S2",
        "state": "READY",
        "firstPlayerId": "01HRESEED0000000000000P201",
        "secondPlayerId": "01HRESEED0000000000000P202",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P202",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """

  Scenario: The attacker overpowers the defender and the targeted character loses health
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    And player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 2.0, "attackingCharacter": "SUNNY", "attackedCharacter": "VEGA" }
      """
    Then player "01HRESEED0000000000000P201" receives "attacked"
    When player "01HRESEED0000000000000P202" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 1.0 }
      """
    Then player "01HRESEED0000000000000P202" receives "turnChanged"
    And I identify as player "01HRESEED0000000000000P202"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        {
          "type": "IRIS",
          "superpower": "LIGHT",
          "stats": { "intelligence": 9, "defense": 4, "power": 4, "health": 6 },
          "isDead": false
        },
        {
          "type": "SKYE",
          "superpower": "AIR",
          "stats": { "intelligence": 4, "defense": 4, "power": 7, "health": 7 },
          "isDead": false
        },
        {
          "type": "SUNNY",
          "superpower": "FIRE",
          "stats": { "intelligence": 3, "defense": 4, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "THORA",
          "superpower": "ELECTRIC",
          "stats": { "intelligence": 5, "defense": 3, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "VEGA",
          "superpower": "GRASS",
          "stats": { "intelligence": 8, "defense": 3, "power": 6, "health": 5 },
          "isDead": false
        }
      ]
      """

  Scenario: The defender overpowers the attacker and the attacking character loses health
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    And player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 1.0, "attackingCharacter": "VEGA", "attackedCharacter": "SUNNY" }
      """
    Then player "01HRESEED0000000000000P201" receives "attacked"
    When player "01HRESEED0000000000000P202" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 2.0 }
      """
    Then player "01HRESEED0000000000000P201" receives "turnChanged"
    And I identify as player "01HRESEED0000000000000P201"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        {
          "type": "IRIS",
          "superpower": "LIGHT",
          "stats": { "intelligence": 9, "defense": 4, "power": 4, "health": 6 },
          "isDead": false
        },
        {
          "type": "SKYE",
          "superpower": "AIR",
          "stats": { "intelligence": 4, "defense": 4, "power": 7, "health": 7 },
          "isDead": false
        },
        {
          "type": "SUNNY",
          "superpower": "FIRE",
          "stats": { "intelligence": 3, "defense": 4, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "THORA",
          "superpower": "ELECTRIC",
          "stats": { "intelligence": 5, "defense": 3, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "VEGA",
          "superpower": "GRASS",
          "stats": { "intelligence": 8, "defense": 3, "power": 6, "health": 5 },
          "isDead": false
        }
      ]
      """

  Scenario: Equal damage on both sides deals no damage
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    And player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 1.5, "attackingCharacter": "IRIS", "attackedCharacter": "SKYE" }
      """
    Then player "01HRESEED0000000000000P201" receives "attacked"
    When player "01HRESEED0000000000000P202" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 1.5 }
      """
    Then player "01HRESEED0000000000000P202" receives "turnChanged"
    And I identify as player "01HRESEED0000000000000P202"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        {
          "type": "IRIS",
          "superpower": "LIGHT",
          "stats": { "intelligence": 9, "defense": 4, "power": 4, "health": 6 },
          "isDead": false
        },
        {
          "type": "SKYE",
          "superpower": "AIR",
          "stats": { "intelligence": 4, "defense": 4, "power": 7, "health": 7 },
          "isDead": false
        },
        {
          "type": "SUNNY",
          "superpower": "FIRE",
          "stats": { "intelligence": 3, "defense": 4, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "THORA",
          "superpower": "ELECTRIC",
          "stats": { "intelligence": 5, "defense": 3, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "VEGA",
          "superpower": "GRASS",
          "stats": { "intelligence": 8, "defense": 3, "power": 6, "health": 8 },
          "isDead": false
        }
      ]
      """

  Scenario: A character that takes lethal damage dies and both players are notified
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    And player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 2.0, "attackingCharacter": "SKYE", "attackedCharacter": "SUNNY" }
      """
    Then player "01HRESEED0000000000000P201" receives "attacked"
    And player "01HRESEED0000000000000P202" receives "attacked"
    When player "01HRESEED0000000000000P202" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 1.0 }
      """
    Then player "01HRESEED0000000000000P201" receives "turnChanged"
    And player "01HRESEED0000000000000P202" receives "turnChanged"
    When player "01HRESEED0000000000000P202" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 2.0, "attackingCharacter": "SKYE", "attackedCharacter": "SUNNY" }
      """
    Then player "01HRESEED0000000000000P201" receives "attacked"
    And player "01HRESEED0000000000000P202" receives "attacked"
    When player "01HRESEED0000000000000P201" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 1.0 }
      """
    Then player "01HRESEED0000000000000P201" receives "turnChanged"
    And player "01HRESEED0000000000000P202" receives "turnChanged"
    When player "01HRESEED0000000000000P201" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 2.0, "attackingCharacter": "SKYE", "attackedCharacter": "SUNNY" }
      """
    Then player "01HRESEED0000000000000P201" receives "attacked"
    And player "01HRESEED0000000000000P202" receives "attacked"
    When player "01HRESEED0000000000000P202" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 1.0 }
      """
    Then player "01HRESEED0000000000000P201" receives "characterDied" with:
      """
      { "playerId": "01HRESEED0000000000000P202", "character": "SUNNY" }
      """
    And player "01HRESEED0000000000000P202" receives "characterDied" with:
      """
      { "playerId": "01HRESEED0000000000000P202", "character": "SUNNY" }
      """
    And I identify as player "01HRESEED0000000000000P202"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        {
          "type": "IRIS",
          "superpower": "LIGHT",
          "stats": { "intelligence": 9, "defense": 4, "power": 4, "health": 6 },
          "isDead": false
        },
        {
          "type": "SKYE",
          "superpower": "AIR",
          "stats": { "intelligence": 4, "defense": 4, "power": 7, "health": 7 },
          "isDead": false
        },
        {
          "type": "SUNNY",
          "superpower": "FIRE",
          "stats": { "intelligence": 3, "defense": 4, "power": 8, "health": 0 },
          "isDead": true
        },
        {
          "type": "THORA",
          "superpower": "ELECTRIC",
          "stats": { "intelligence": 5, "defense": 3, "power": 8, "health": 6 },
          "isDead": false
        },
        {
          "type": "VEGA",
          "superpower": "GRASS",
          "stats": { "intelligence": 8, "defense": 3, "power": 6, "health": 8 },
          "isDead": false
        }
      ]
      """

  Scenario: A player cannot attack with an out-of-range quick time multiplier
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 2.5, "attackingCharacter": "SUNNY", "attackedCharacter": "VEGA" }
      """
    Then player "01HRESEED0000000000000P201" receives "exception" with:
      """
      {
        "status": "error",
        "message": "Message validation failed.",
        "violations": {
          "quickTimeEventMultiplier": ["quickTimeEventMultiplier must not be greater than 2"]
        }
      }
      """

  Scenario: A player cannot attack when it is not their turn
    Given player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P202" emits "attack" with:
      """
      { "quickTimeEventMultiplier": 1.5, "attackingCharacter": "SUNNY", "attackedCharacter": "VEGA" }
      """
    Then player "01HRESEED0000000000000P202" receives "exception" with:
      """
      {
        "status": "error",
        "message": "It is not your turn to attack.",
        "cause": {
          "pattern": "attack",
          "data": { "quickTimeEventMultiplier": 1.5, "attackingCharacter": "SUNNY", "attackedCharacter": "VEGA" }
        }
      }
      """

  Scenario: A player cannot defend when no attack is pending
    Given player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P202" emits "defend" with:
      """
      { "quickTimeEventMultiplier": 1.5 }
      """
    Then player "01HRESEED0000000000000P202" receives "exception" with:
      """
      {
        "status": "error",
        "message": "There is no attack to defend against.",
        "cause": {
          "pattern": "defend",
          "data": { "quickTimeEventMultiplier": 1.5 }
        }
      }
      """

  Scenario: A player who does not belong to the session cannot connect
    Given player "01HRESEED0000000000000P101" connects to the session channel for "01HRESEED000000000000000S2"
    Then player "01HRESEED0000000000000P101" connection is rejected
