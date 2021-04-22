
export default function Home(props) {

  console.log('props', props.episodes)
  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes, null, 2)}</p>
    </>

  )
}



export async function getStaticProps() {

  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
       episodes: data,
    },
    revalidate: 60 * 60 * 8, /// 8 horas
  }
}
