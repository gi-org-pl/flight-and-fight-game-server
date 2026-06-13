Feature: As a player I can see all available characters

  Scenario: I list all available characters
    When I send a "GET" request to "/api/v1/characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        { "type": "IRIS", "stats": { "health": 6, "power": 4, "defense": 4, "intelligence": 9 } },
        { "type": "ZEPHYR", "stats": { "health": 6, "power": 5, "defense": 5, "intelligence": 4 } },
        { "type": "WENDY", "stats": { "health": 8, "power": 4, "defense": 7, "intelligence": 3 } },
        { "type": "SKYE", "stats": { "health": 7, "power": 7, "defense": 4, "intelligence": 4 } },
        { "type": "SUNNY", "stats": { "health": 6, "power": 8, "defense": 4, "intelligence": 3 } },
        { "type": "AURA", "stats": { "health": 5, "power": 5, "defense": 6, "intelligence": 7 } },
        { "type": "NEIL", "stats": { "health": 7, "power": 7, "defense": 5, "intelligence": 7 } },
        { "type": "GALE", "stats": { "health": 9, "power": 7, "defense": 8, "intelligence": 6 } },
        { "type": "THORA", "stats": { "health": 6, "power": 8, "defense": 3, "intelligence": 5 } },
        { "type": "VEGA", "stats": { "health": 8, "power": 6, "defense": 3, "intelligence": 8 } },
      ]
      """
