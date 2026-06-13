Feature: As a player I attack and defend in real time

  Background:
    Given I use seed data

  Scenario: The attacker attacks, the defender defends, and the turn flips
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    And player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "attack"
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
        { "type": "IRIS", "stats": { "intelligence": 4, "defense": 3, "power": 3, "health": 5, "refresh": 6 } },
        { "type": "SKYE", "stats": { "intelligence": 5, "defense": 5, "power": 6, "health": 6, "refresh": 6 } },
        { "type": "SUNNY", "stats": { "intelligence": 6, "defense": 4, "power": 7, "health": 5, "refresh": 7 } },
        { "type": "THORA", "stats": { "intelligence": 9, "defense": 6, "power": 8, "health": 8, "refresh": 9 } },
        { "type": "VEGA", "stats": { "intelligence": 8, "defense": 9, "power": 10, "health": 10, "refresh": 5 } }
      ]
      """
    When player "01HRESEED0000000000000P202" emits "defend"
    Then player "01HRESEED0000000000000P201" receives "turnChanged" with:
      """
      {
        "id": "01HRESEED000000000000000S2",
        "state": "CLOSED",
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
        "state": "CLOSED",
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
        "state": "CLOSED",
        "firstPlayerId": "01HRESEED0000000000000P201",
        "secondPlayerId": "01HRESEED0000000000000P202",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P202",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """

  Scenario: A player cannot attack when it is not their turn
    Given player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P202" emits "attack"
    Then player "01HRESEED0000000000000P202" receives "exception" with:
      """
      {
        "status": "error",
        "message": "It is not your turn to attack.",
        "cause": { "pattern": "attack" }
      }
      """

  Scenario: A player cannot defend when no attack is pending
    Given player "01HRESEED0000000000000P202" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P202" emits "defend"
    Then player "01HRESEED0000000000000P202" receives "exception" with:
      """
      {
        "status": "error",
        "message": "There is no attack to defend against.",
        "cause": { "pattern": "defend" }
      }
      """

  Scenario: A player who does not belong to the session cannot connect
    Given player "01HRESEED0000000000000P101" connects to the session channel for "01HRESEED000000000000000S2"
    Then player "01HRESEED0000000000000P101" connection is rejected
