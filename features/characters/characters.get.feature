Feature: As a player I can see all available characters

  Scenario: I list all available characters
    When I send a "GET" request to "/characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        { "type": "AURA", "stats": { "intelligence": 8, "defense": 5, "power": 5, "health": 5, "refresh": 6 } },
        { "type": "GALE", "stats": { "intelligence": 7, "defense": 8, "power": 8, "health": 9, "refresh": 6 } },
        { "type": "IRIS", "stats": { "intelligence": 4, "defense": 3, "power": 3, "health": 5, "refresh": 6 } },
        { "type": "NEIL", "stats": { "intelligence": 6, "defense": 6, "power": 7, "health": 7, "refresh": 5 } },
        { "type": "SKYE", "stats": { "intelligence": 5, "defense": 5, "power": 6, "health": 6, "refresh": 6 } },
        { "type": "SUNNY", "stats": { "intelligence": 6, "defense": 4, "power": 7, "health": 5, "refresh": 7 } },
        { "type": "THORA", "stats": { "intelligence": 9, "defense": 6, "power": 8, "health": 8, "refresh": 9 } },
        { "type": "VEGA", "stats": { "intelligence": 8, "defense": 9, "power": 10, "health": 10, "refresh": 5 } },
        { "type": "WENDY", "stats": { "intelligence": 7, "defense": 3, "power": 2, "health": 4, "refresh": 5 } },
        { "type": "ZEPHYR", "stats": { "intelligence": 3, "defense": 5, "power": 3, "health": 6, "refresh": 4 } }
      ]
      """
