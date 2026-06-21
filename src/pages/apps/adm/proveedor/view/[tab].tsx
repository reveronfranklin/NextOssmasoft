import axios from 'axios'
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import MainPage from 'src/adm/proveedor/view/MainPage'

const ProveedorView = ({ tab, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <MainPage tab={tab} invoiceData={invoiceData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'resumen' } },
      { params: { tab: 'direccion' } },
      { params: { tab: 'contacto' } },
      { params: { tab: 'comunicacion' } },
      { params: { tab: 'actividad' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData: InvoiceType[] = res.data.allData

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default ProveedorView
