import { useEffect, useState } from 'react'

import styled from 'styled-components'

const Content = styled.div`
  background: #021122;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input`
  border: 0;
  padding: 20px;
`;

const Button = styled.button`
  border: 0;
  padding: 20px;
  background: #D61a52;
  color: white;
`;

const List = styled.ul`
  margin-top: 40px;
  background: white;
  padding: 20px;
`;

const useSummonerId = () => {
  const [summonerId, setSummonerId] = useState(null);

  const getSummonerId = (userName) => {
    var RiotRequest = require('riot-lol-api');

    var riotRequest = new RiotRequest(process.env.NEXT_PUBLIC_API_KEY);

    riotRequest.request('br1', 'summoner', `/lol/summoner/v4/summoners/by-name/${userName}`, function(error, data) {
      if (error) {
        console.log(`Usuário ${userName} não encontrado.`);
      }

      if (data.id) {
        setSummonerId(data.id);
      }
    });
  };

  return [summonerId, getSummonerId];
};

const useCurrentGameInfo = () => {
  const [currentGameInfo, setCurrentGameInfo] = useState(null);

  const getCurrentGameInfo = (encryptedSummonerId) => {
     var RiotRequest = require('riot-lol-api');

    var riotRequest = new RiotRequest(process.env.NEXT_PUBLIC_API_KEY);

    riotRequest.request('br1', 'summoner', `/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}`, function(error, data) {
      if (error) {
        console.log(`Usuário não está jogando neste momento.`);
      }

      if (data.gameId) {
        setCurrentGameInfo(data);
      }
    });
  };

  return [currentGameInfo, getCurrentGameInfo];
};

export default function Home() {
  const [valueInput, setValueInput] = useState('');

  const [summonerId, getSummonerId] = useSummonerId();
  const [currentGameInfo, getCurrentGameInfo] = useCurrentGameInfo();

  const [enemyTeam, setEnemyTeam] = useState([]);

  useEffect(() => {
    if (summonerId) {
      getCurrentGameInfo(summonerId);
    }
  }, [summonerId]);

  useEffect(() => {
    setEnemyTeam(currentGameInfo?.participants.filter(user => (user.teamId === 100)))
  }, [currentGameInfo]);

  const onSubmit = (e) => {
    e.preventDefault();
    getSummonerId(valueInput);
  };

  return (
    <Content>
      <form onSubmit={onSubmit}>
        <Input value={valueInput} onChange={e => setValueInput(e.target.value)}/>
        <Button type="submit">Search</Button>
      </form>
      {enemyTeam?.length && (
          <List>
            {enemyTeam.map((enemy, i) => (
              <li key={i}>{enemy.summonerName}</li>
            ))}
          </List>
        )
      }
    </Content>
  )
}
