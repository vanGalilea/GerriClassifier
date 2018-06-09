import {Component} from 'react';
import App, {Container} from 'next/app';
import Head from "next/head";

class Layout extends Component {
    render () {
        const {children} = this.props;
        return (
            <div className='layout'>
                <Head>
                    <title>
                        Feli-retail
                    </title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta name="description" content=""/>

                </Head>
                {children}

                {/*language=SCSS*/}
                <style jsx>
                    {`
                            .layout {
                                height: 100vh;
                            }
                        `}
                </style>
            </div>
        )
    }
}

export default class RootApp extends App {
    render () {
        const {Component, pageProps} = this.props;
        return (
            <Container>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Container>
        )
    }
}

