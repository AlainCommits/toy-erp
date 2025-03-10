// storage-adapter-import-placeholder
// Entferne den direkten mongoose Import
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { en } from '@payloadcms/translations/languages/en'
import { de } from '@payloadcms/translations/languages/de'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
// Change to default import to match the export in Users/index.ts
import Users from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Products } from './collections/ERP/Products'
import { Suppliers } from './collections/ERP/Suppliers'
import { Customers } from './collections/ERP/Customers'
import { Orders } from './collections/ERP/Orders'
import { Inventory } from './collections/ERP/Inventory'
import { Purchases } from './collections/ERP/Purchases'
import { Invoices } from './collections/ERP/Invoices'
import { Payments } from './collections/ERP/Payments'
import { Warehouses } from './collections/ERP/Warehouses'
import { ShippingMethods } from './collections/ERP/ShippingMethods'
import { TaxRates } from './collections/ERP/TaxRates'
import { Reports } from './collections/ERP/Reports'
import { Documents } from './collections/ERP/Documents'
import { Integrations } from './collections/ERP/Integrations'
import { AuditLogs } from './collections/ERP/AuditLogs'
import { Revenue } from './collections/ERP/Revenue'
import { ReportingCategories } from './collections/ERP/ReportingCategories'
import { FinancialManagement } from './collections/ERP/FinancialManagement'
import type { Config } from './payload-types'
import { Tenants } from './collections/Tenants'
import { isSuperAdmin } from './access/isSuperAdmin'
import { getUserTenantIDs } from './utilities/getUserTenantIDs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Entferne die direkte mongoose.connect Nutzung
// Der mongooseAdapter übernimmt die Verbindungsherstellung

export default buildConfig({
  i18n: {
    fallbackLanguage: 'de',
    supportedLanguages: { en, de },
  },
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      // beforeDashboard: ['@/components/BeforeDashboard'],
      beforeDashboard: ['@/components/Dashboard'],

      // Custom Dashboard component that replaces the default dashboard
      // Use 'afterDashboard' to place it after the default dashboard
      afterDashboard: ['@/components/Dashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: 'users', // Direkter String statt Users.slug
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    // Hier können additional connection options hinzugefügt werden, wenn nötig
  }),
  collections: [
    Tenants, 
    Pages, 
    Posts, 
    Media, 
    Categories, 
    Users,
    Products,
    Suppliers,
    Customers,
    Orders,
    Inventory,
    Purchases,
    Invoices,
    Payments,
    Warehouses,
    ShippingMethods,
    TaxRates,
    Reports,
    Documents,
    Integrations,
    AuditLogs,
    Revenue,
    ReportingCategories,
    FinancialManagement, // Neue Collection hinzugefügt
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    // Re-add the plugins import which contains the redirects plugin
    ...plugins,
    multiTenantPlugin<Config>({
      // Using proper format from documentation
      collections: {
        // Only define collections that should be multi-tenant
        tenants: {},
        users: {},
        pages: {},
        posts: {},
        media: {},
        categories: {},
        products: {},
        suppliers: {},
        customers: {},
        orders: {},
        // inventory: {},
        purchases: {},
        invoices: {},
        payments: {},
        warehouses: {},
        // shippingMethods: {},
        // taxRates: {},
        reports: {},
        documents: {},
        integrations: {},
        // auditLogs: {},
        revenue: {},
        // reportingCategories: {},
        // financialManagement: {},
      },
      // Tenant field access
      tenantField: {
        access: {
          read: () => true, // Allow read access to tenant field
          update: ({ req }) => isSuperAdmin(req.user) || getUserTenantIDs(req.user).length > 0
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      // Function to determine if user has access to all tenants
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
