// StAuth10244: I Omar ElGaml, 000793541 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';

const API_KEY = '613e22a372f4c56eb8688bd9d3ca8403'; // Replace with your actual API key

const leagues = [
  { id: 39, name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 78, name: 'Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 135, name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' }
];

export default function App() {
  const [standings, setStandings] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(null);

  // Fetch standings for the selected league
  const fetchStandings = async (leagueId) => {
    try {
      const response = await fetch(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=2022`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const leagueStandings = data.response[0]?.league.standings[0] || [];
      setStandings(leagueStandings);
      setError(null);
    } catch (err) {
      setError(err.message);
      setStandings([]);
    }
  };

  // Handler for league button click
  const handleLeagueSelect = (league) => {
    setSelectedLeague(league);
    fetchStandings(league.id);
    setSearchText('');
  };

  // Handler for Reset button click
  const handleReset = () => {
    setSelectedLeague(null);
    setStandings([]);
    setSearchText('');
    setError(null);
  };

  // Filter standings based on search text
  const filteredStandings = standings.filter((team) =>
    team.team.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Football League Standings</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Render league buttons */}
      <View style={styles.leagueButtons}>
        {leagues.map((league) => (
          <TouchableOpacity key={league.id} onPress={() => handleLeagueSelect(league)} style={styles.leagueButton}>
            <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
            <Text style={styles.leagueText}>{league.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render Reset button */}
      <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>

      {/* Search bar */}
      {selectedLeague && (
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a team..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Display selected league and standings */}
      {selectedLeague && <Text style={styles.selectedLeague}>{selectedLeague.name} Standings</Text>}
      <FlatList
        data={filteredStandings}
        keyExtractor={(team) => `${team.team.id}-${team.rank}`}
        renderItem={({ item }) => (
          <View style={styles.standingItem}>
            <Text>
              {item.rank}. {item.team.name} - {item.points} pts
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Explicitly set background to white
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  leagueButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  leagueButton: {
    alignItems: 'center'
  },
  leagueLogo: {
    width: 50,
    height: 50,
    marginBottom: 5
  },
  leagueText: {
    fontSize: 14,
    color: '#007AFF'
  },
  resetButton: {
    alignSelf: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold'
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  selectedLeague: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  standingItem: {
    marginVertical: 5
  }
});
