Feature: As a player I choose my characters over the websocket

  Background:
    Given I use seed data

  Scenario: Both players choose characters and the game becomes ready
    Given player "01HRESEED0000000000000P301" connects to the session channel for "01HRESEED000000000000000S3"
    And player "01HRESEED0000000000000P302" connects to the session channel for "01HRESEED000000000000000S3"
    When player "01HRESEED0000000000000P301" emits "selectCharacters" with:
      """
      { "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"] }
      """
    And player "01HRESEED0000000000000P301" emits "selectCharacters" with:
      """
      { "characters": ["IRIS", "ZEPHYR", "WENDY", "SKYE", "SUNNY"] }
      """
    And player "01HRESEED0000000000000P302" emits "selectCharacters" with:
      """
      { "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"] }
      """
    Then player "01HRESEED0000000000000P301" receives "ready" with:
      """
      {
        "id": "01HRESEED000000000000000S3",
        "state": "READY",
        "firstPlayerId": "01HRESEED0000000000000P301",
        "secondPlayerId": "01HRESEED0000000000000P302",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P301",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """
    And player "01HRESEED0000000000000P302" receives "ready" with:
      """
      {
        "id": "01HRESEED000000000000000S3",
        "state": "READY",
        "firstPlayerId": "01HRESEED0000000000000P301",
        "secondPlayerId": "01HRESEED0000000000000P302",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P301",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """

  Scenario: A player cannot choose a selection that is not exactly 5 characters
    Given player "01HRESEED0000000000000P301" connects to the session channel for "01HRESEED000000000000000S3"
    When player "01HRESEED0000000000000P301" emits "selectCharacters" with:
      """
      { "characters": ["IRIS", "SKYE", "SUNNY", "THORA"] }
      """
    Then player "01HRESEED0000000000000P301" receives "exception" with:
      """
      {
        "status": "error",
        "message": "You must select exactly 5 unique known characters.",
        "cause": {
          "pattern": "selectCharacters",
          "data": { "characters": ["IRIS", "SKYE", "SUNNY", "THORA"] }
        }
      }
      """

  Scenario: A player cannot choose characters once the game is ready
    Given player "01HRESEED0000000000000P201" connects to the session channel for "01HRESEED000000000000000S2"
    When player "01HRESEED0000000000000P201" emits "selectCharacters" with:
      """
      { "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"] }
      """
    Then player "01HRESEED0000000000000P201" receives "exception" with:
      """
      {
        "status": "error",
        "message": "Characters can no longer be changed.",
        "cause": {
          "pattern": "selectCharacters",
          "data": { "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"] }
        }
      }
      """
