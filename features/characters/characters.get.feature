Feature: As a player I can see all available characters

  Scenario: I list all available characters
    When I send a "GET" request to "/api/v1/characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        { "type": "IRIS", "superpower": "LIGHT", "stats": { "intelligence": 9, "defense": 4, "power": 4, "health": 6 } },
        { "type": "ZEPHYR", "superpower": "DARK", "stats": { "intelligence": 4, "defense": 5, "power": 5, "health": 6 } },
        { "type": "WENDY", "superpower": "GROUND", "stats": { "intelligence": 3, "defense": 7, "power": 4, "health": 8 } },
        { "type": "SKYE", "superpower": "AIR", "stats": { "intelligence": 4, "defense": 4, "power": 7, "health": 7 } },
        { "type": "SUNNY", "superpower": "FIRE", "stats": { "intelligence": 3, "defense": 4, "power": 8, "health": 6 } },
        { "type": "AURA", "superpower": "ICE", "stats": { "intelligence": 7, "defense": 6, "power": 5, "health": 5 } },
        { "type": "NEIL", "superpower": "WATER", "stats": { "intelligence": 7, "defense": 5, "power": 7, "health": 7 } },
        { "type": "GALE", "superpower": "ICE", "stats": { "intelligence": 6, "defense": 8, "power": 7, "health": 9 } },
        { "type": "THORA", "superpower": "ELECTRIC", "stats": { "intelligence": 5, "defense": 3, "power": 8, "health": 6 } },
        { "type": "VEGA", "superpower": "GRASS", "stats": { "intelligence": 8, "defense": 3, "power": 6, "health": 8 } }
      ]
      """
