import { useState } from 'react'

import styled from 'styled-components'

const Content = styled.div`
  background: #021122;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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

export default function Home() {
  const [valueInput, setValueInput] = useState('sushi lover')

  const searchSummonerName = (userName) => {
    var RiotRequest = require('riot-lol-api');

    var riotRequest = new RiotRequest(process.env.NEXT_PUBLIC_API_KEY);

    riotRequest.request('br1', 'summoner', `/lol/summoner/v4/summoners/by-name/${userName}`, function(err, data) {
      err && console.log('error: ', err)
      data && console.log('data: ', data)
    });
  }

  const onSubmit = () => {
    searchSummonerName(valueInput);
  }

  return (
    <Content>
      <Input value={valueInput} onChange={e => setValueInput(e.target.value)}/>
      <Button onClick={() => onSubmit()}>Search</Button>
    </Content>
  )
}
