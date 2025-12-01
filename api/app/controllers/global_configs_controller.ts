import { errorHandler } from '#helper/error_handler'
import Role from '#models/role'

import { MobilePermissionsList } from '#types/permissions'
import {
  BranchFloorsList,
  BranchMaintenanceServiceType,
  BranchMaintenanceServiceTypeList,
  BranchType,
  BranchTypeList,
} from '#types/branch'
import {
  RoleAccessLevel,
  RoleAccessLevelList,
  RoleKeys,
  RoleKeysAuditorAppList,
  RoleKeysOwnerAppList,
} from '#types/role'

import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export default class GlobalConfigsController {
  async globalConfigList({}: HttpContext) {
    try {
      const roles = await Role.query().select([
        'id',
        'roleName',
        'roleDescription',
        'roleKey',
        'roleAccessLevel',
      ])

      return {
        roles,
        roleAccessLevel: RoleAccessLevel,
        roleAccessLevelList: RoleAccessLevelList,
        roleKeysOwnerAppList: RoleKeysOwnerAppList,
        roleKeysAuditorAppList: RoleKeysAuditorAppList,
        branchMaintenanceServiceType: BranchMaintenanceServiceType,
        branchMaintenanceServiceTypeList: BranchMaintenanceServiceTypeList,
        branchType: BranchType,
        branchTypeList: BranchTypeList,
        branchFloorsList: BranchFloorsList,
        appMenuLinks: this.getAppMenuLinks(),
      }
    } catch (error) {
      return errorHandler(error)
    }
  }

  async privateConfigs({}: HttpContext) {
    try {
      const roles = await Role.query().select([
        'id',
        'roleName',
        'roleDescription',
        'roleKey',
        'roleAccessLevel',
        'tradeCodeRequired',
      ])

      return {
        mobilePermissions: MobilePermissionsList(),
        accessRoleForResource: {
          organisation: roles.filter((r) =>
            [
              RoleKeys.organisation_admin,
              RoleKeys.branch_auditor,
              RoleKeys.branch_sub_contractor,
              RoleKeys.branch_sales_agent,
            ].includes(r.roleKey)
          ),
          branch: roles.filter((r) =>
            [
              RoleKeys.branch_admin,
              RoleKeys.branch_auditor,
              RoleKeys.branch_sub_contractor,
              RoleKeys.branch_sales_agent,
              RoleKeys.branch_strata,
            ].includes(r.roleKey)
          ),
          property: roles.filter((r) =>
            [RoleKeys.property_owner, RoleKeys.property_tenant, RoleKeys.property_agent].includes(
              r.roleKey
            )
          ),
        },
      }
    } catch (error) {
      return errorHandler(error)
    }
  }

  async configs({}: HttpContext) {
    return ''
  }

  async managedCountryState({}: HttpContext) {
    return ''
  }

  async countries({ response }: HttpContext) {
    const countries = JSON.parse(
      readFileSync(path.join('resources/country/all_country.json'), 'utf-8')
    )
    return response.json(countries)
  }

  async stateFromCountry({ params, response }: HttpContext) {
    const countryCode = params.countryCode.toUpperCase()
    const filePath = path.join(`resources/country/${countryCode}.json`)

    if (!existsSync(filePath)) {
      return response.notFound({ message: 'Country not found' })
    }

    const countryData = JSON.parse(readFileSync(filePath, 'utf-8'))
    return response.json(countryData.states)
  }

  async countryList({}: HttpContext) {
    try {
      const list = [
        {
          id: 1,
          countryName: 'Australia',
          countryCode: 'au',
          timezone: [
            {
              id: 1,
              name: 'Australia/Sydney',
              description: 'Australian Eastern Standard Time (Sydney)',
              abbreviation: 'AEST',
              offset: '+10:00',
            },
            {
              id: 2,
              name: 'Australia/Adelaide',
              description: 'Australian Central Standard Time (Adelaide)',
              abbreviation: 'ACST',
              offset: '+09:30',
            },
            {
              id: 3,
              name: 'Australia/Perth',
              description: 'Australian Western Standard Time (Perth)',
              abbreviation: 'AWST',
              offset: '+08:00',
            },
            {
              id: 4,
              name: 'Australia/Darwin',
              description: 'Australian Central Standard Time (Darwin)',
              abbreviation: 'ACST',
              offset: '+09:30',
            },
            {
              id: 5,
              name: 'Australia/Brisbane',
              description: 'Australian Eastern Standard Time (Brisbane)',
              abbreviation: 'AEST',
              offset: '+10:00',
            },
            {
              id: 6,
              name: 'Australia/Hobart',
              description: 'Australian Eastern Daylight Time (Hobart)',
              abbreviation: 'AEDT',
              offset: '+11:00',
            },
            {
              id: 7,
              name: 'Australia/Melbourne',
              description: 'Australian Eastern Standard Time (Melbourne)',
              abbreviation: 'AEST',
              offset: '+10:00',
            },
          ],
        },
      ]
      return {
        data: list,
      }
    } catch (error) {
      return errorHandler(error)
    }
  }

  getAppMenuLinks() {
    return [
      {
        title: 'About',
        slug: 'about',
        content:
          "<h1>hatiri</h1>\n<p>hatiri is a platform designed to assist you whether you're embarking on a journey to purchase your own home or apartment as an owner, or closing the gaps in communications, quality and compliance as a builder.</p>",
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content:
          "<div class='container'><h1 class='jumbo blue'>Privacy</h1><p class='jumbo-paragraph no-margin'>This Privacy Policy outlines our responsibility in protecting the privacy of the personal information that we collect through our mobile applications and website propedge.com.au.&nbsp;<br><br>Please read its contents carefully and contact us if you have any questions or concerns.&nbsp;<br><br><span class='text-span'>What is Personal Information</span><br>“Personal Information” means any data or information in any media that on its own or when combined with other data could identify a particular individual, or any other data or information that constitutes personal data under applicable law. Examples of Personal Data include an individual's combined first and last name, address, telephone number, email address, geolocation information of an individual or device and credit card or other financial information (including bank account information). &nbsp;Personal Data also includes cookie identifiers associated with registration information, or any other browser or device specific number or identifier not controllable by the end user, and web or mobile browsing or usage information that is linked to the foregoing. <br><br>Personal Information does not include information that is de-identified, aggregated, or anonymised as defined by applicable law.&nbsp;<br><br><span class='text-span-2'>Collection of Personal Information </span><br>hatiri is an intuitive application that makes it easier for you to have direct communication with your builder to create and account and login there will be some personal information which we collect about you. If you have been asked to download the hatiri application or visit our website it is likely that your Developer/Builder is using our platform to manage the handover and defect reporting experience. By providing your personal information you indicate that you have read this Privacy Policy and agree with its contents.<br><br>In relation to our website additional information regarding your visit to the website will also be captured. This includes the duration spent on the site, the specific pages you visit and the source that referred you to this website (if applicable). None of this information is linked to personally identifiable information and is used only for internal purposes such as statistical analysis and end-user improvements.&nbsp;Any personal information that we may receive from a third party will be protected as per this Privacy Policy.&nbsp;<br><br><span class='text-span-3'>Use of Personal Information</span><br>This Privacy Notice may apply to hatiri's software-as-a-service products, including the licensed software available through our platform and any software, mobile applications, products, devices, or other services (collectively 'hatiri Platform').<br><br>We will normally collect personal information from you only where we have your consent to do so, this personal information from you allows us to protect your vital interests or those of another users, as in accordance with the purpose of our product. Your personal information may be used for the following activities:&nbsp;<br>- Communicating with you<br>- Internal records and event management<br>- Security credentials for registration and login<br>- Photos and comments submitted for defect tracking<br>- Profile information that you provide us with<br>- Direct and Indirect marketing<br>- Data Analytics, performance enhancing cookies and other site cookies (Users can opt out of cookies)<br><br>With some of the Personal Information processed through the hatiri Platform automatically, we act as a processor/service provider and will only process such information on behalf of and in accordance with the instructions of our users.&nbsp;<br><br><span class='text-span-4'>Sharing of Personal Information</span><br>Any personal information collected will not be shared with any other organisation or third party unless absolutely required for the purposes in delivering our services to you. Any sharing of information toService Providers will not be carried out through your permission.<br><br>Any other party will be bound by confidentiality and privacy agreements to ensure the continued protection of the personal information. We will only work with service providers that we believe to be trustworthy and have privacy practices consistent with ours. For example, we contract with Service Providers to provide certain services to you for defect fixes and corrections.&nbsp;<br><br><span class='text-span-5'>Accessing your personal information</span><br>You have the right to access your personal information as per the guidelines in the Privacy Act 1988 (Cth). Please note that if we provide your personal details, we may charge a small administrative fee to search for and provide access on a per request basis.&nbsp;If you believe any of the personal information we hold about you is incomplete or incorrect, please contact us to get it updated.<br><br><span class='text-span-6'>Information Security &amp; Retention</span><br>hatiri is serious about Information Security and we have implemented numerous security measures to achieve that goal. The hatiri Platform will retain your information for as long as we have an ongoing relationship with you or the business need to do so (for example: to comply with applicable law, tax requirements, or to enforce our agreements).<br><br>In addition, we implement layers of appropriate operational and technical safeguards designed to protect your Personal Information from accidental or unlawful use, destruction, loss, alteration, unauthorised disclosure, or access.<br><br><span class='text-span-7'>Changes to this Policy</span><br>This Privacy Policy may be changed occasionally(including both additions and deletions) at our discretion. Your continued use of the mobile application and website indicates that you accept these changes.This Privacy Policy should be checked to ensure your agreement to its terms. If you have objections to the changes, you should not access or use this website.<br><br><span class='text-span-8'>Links to third party services or websites</span><br>This website may contain links to other websites via blog posts, comments or any of the page content. These other websites are not governed by this Privacy Policy and hatiri Pty Ltd has no influence over these websites. Any personal information you provide to those websites is not the responsibility of hatiri to protect. You should ensure you agree to theirPrivacy Policy (if available).<br><br><span class='text-span-9'>Contacting Us</span><br>If you have any concerns about this Privacy Policy, want to ask any questions or would like to discuss anything to do with thisPrivacy Policy, please contact us using the details below and we will respond as soon as reasonably possible.<br><br><strong>hatiri Pty Ltd</strong><br>11 Egerton Street,<br>Silverwater NSW 2128<br>‍<a href='mailto:privacy@propedge.com.au' class='link-2'>privacy@propedge.com.au</a></p><div class='spacer-100px'></div></div>",
      },
      {
        title: 'End User Agreement',
        slug: 'end-user-agreement',
        content:
          "<div class='container'><h1 class='jumbo blue'>End User Agreement</h1><p class='jumbo-paragraph no-margin'>hatiri (“Licensed Application”) is a piece of software created to bridge the gaps between apartment and home owners and their builder, and customised for iOS and Android mobile devices (“Devices”). It is used as an intuitive platform that makes owning a new apartment or home easier for owners by streamlining communications between the owner and builder, while providing real-time situational awareness of the state of a defect or issue to each user. Our platform addresses the various stages of the construction process and simplifies auditing, handover and warranty defect reporting after owners move into their new home or apartment.&nbsp;<br><br>The&nbsp;propedge.com.au website, any software, mobile applications, products, devices, or other services offered by hatiri Pty Ltd and other services offered through third parties integrating hatiri functionality (collectively, “Offering” or “Offerings”), are made available by hatiri Pty Ltd., its subsidiaries, and/or affiliates (hatiri, its subsidiaries, and affiliates are collectively, “we”, “us”, “our”, “hatiri” or “hatiri“). &nbsp;<br><br>You may access and use the Offerings only under the following terms and conditions (“Terms”). If you are a user of a PaidSubscription with hatiri, termed “Paid Offering”, the Master ServicesAgreement of the Paid Offering will take precedence over any conflict with these Terms.<br><br><span class='text-span'>Eligibility</span><br>If you use hatiri or any other product of hatiri PtyLtd you at least 18 years of age and have legal authority to engage with the hatiri Platform for the desired service or Offering.<br><br><span class='text-span-2'>Registration of Account</span><br>For hatiri to be able to provide you with access to the full level of service needed for the Offering you agree to provide accurate and complete Personal Information, truthful information and up-to-date information. As a registered user of our service you agree to maintain the confidentiality of your account credentials and of information that it gathered through your account. You are not permitted to transfer or assign access of your account to any other individual without hatiri's written permission to do so.<br><br><span class='text-span-3'>Notification</span><br>You acknowledge that be registering an account with hatiri you will receive notifications and regular updates regarding services offered through the platform. You may also receive regular marketing communications regarding best practices and new product features. These updates will be sent to you through:<br><br>1. In-app notifications<br>2. SMS notifications to the registered contact number.<br>3. Notifications and Marketing to the email address you provided<br>‍<br>You can opt-out of receiving marketing communications from hatiri at any time using the unsubscribe link within each email.<br><br><span class='text-span-4'>Licensing &amp;&nbsp;Restrictions</span><br>As a user of hatiri, you are granted a non-exclusive, non-transferable, non-sublicensable, revocable, limited license to access and use the platforms Offerings per these Terms. hatiri may terminate the license to it's product at any time for any reason. Certain Offerings require login information as described below. Notwithstanding the license in this section, certain Offerings require you to register to access and use certain of theOfferings' features.<br><br><span class='text-span-5'>Limitations</span><br>Any unauthorized use of the Offerings is prohibited.You may not use the Offerings to: <br><br>1. Copy, modify, reproduce, republish, distribute, display, or transmit for commercial, non-profit, or public purposes all or any portion of the Offerings or any information obtained from the Offerings, either directly or through a third party.<br>2. Extract, decompile, reverse engineer, disassemble, or create derivative works from or competitive products of the Offerings.<br>3. Create a false identity, misrepresent your identity, create a profile for anyone other than yourself, or use or attempt to use another's account; <br>4. Disclose information that you do not have the consent to disclose (such as confidential information of others, including your employer); <br>5. Determine the Offerings' architecture or extract data or information about usage, or individual identities of other users of the Offerings via use of any &nbsp; &nbsp; network monitoring or discovery software or otherwise. Override any security feature or bypass or circumvent any access controls or use limits of the Offerings; <br>6. Transmit any computer virus, worm, defect, trojan horse, or any other item of a destructive nature, or to upload any virus or malicious code. <br>7. Transmit any false, misleading, fraudulent, or illegal communications, information, or data. <br>8. Phish, spoof, commit illegal or fraudulent activity, or violate applicable laws or regulations. <br>9. Use bots or other automated methods to access the Offerings, add or download contacts, or send or redirect messages; <br>10. Monitor the Offerings' availability, performance, or functionality for any competitive purpose; <br>11. Damage, interfere, disable, or impair the operation of, or place an unreasonable load on, the Offerings (e.g., spam, denial of service attack, viruses, gaming algorithms); or <br>12. Violate the intellectual property rights of others, including copyrights, patents, trademarks, trade secrets, or other proprietary rights.<br><br>You acknowledge that hatiri have the right to monitor your access or use of the Offerings for the purpose of operating and improving the Offerings (including without limitation for security analysis, fraud prevention, risk assessment, troubleshooting and customer support purposes), to ensure your compliance with these Terms and to comply with applicable law or the order or requirement of a court, consent decree, administrative agency, or other governmental body.<br><br><span class='text-span-6'>Licensing your Content</span><br>Certain content uploaded by you to the hatiri application and hatiri Offering for the purpose of hatiri providing the service under the Offering will remain with hatiri and hatiri. PublicContent and Non-Public Content are collectively your “Content” that you own and have the right to provide (and share) and you grant hatiri the license set forth to use that content.<br><br><span class='text-span-7'>Limitation of Liability</span><br>To the fullest extent of the Law (and unless hatiri has entered into a separate written agreement that overrides these terms), hatiri will not be liable for any loss, injury, claim, liability, loss of data or damage of any kind (whether direct or indirectly) resulting from your use of the Offerings. &nbsp;<br><br><span class='text-span-8'>Indemnification</span><br>You agree to indemnify, defend, and hold hatiri PtyLtd, and its affiliates, officers, directors, employees, agents, licensors, and suppliers harmless from and against all claims, losses, expenses, damages, andcosts, including reasonable attorneys' fees, arising out of or relating to: (1)your access to or use of the Offerings, including your Content, (2) your violation of these Terms, (3) your breach of your representations and warranties provided under these Terms, (4) your products or services, or the marketing or provision thereof to end users, or (5) the infringement by you, or any third party using your account, of any intellectual property or other right of any person or entity. hatiri Pty Ltd reserves the right, at your expense, to assume the exclusive defence and control of any matter for which you are required to indemnify us and you agree to cooperate with our defence of these claims. You agree not to settle any such matter without the prior written consent of hatiri Pty Ltd.<br><br><span class='text-span-8'>Governing Law</span><br>These terms are to be governed by the laws of the state of New South Wales, Australia.<br><br><span class='text-span-9'>Privacy</span><br>View our Privacy Policy located here: <a href='https://www.hatiri.tech/privacy' target='_blank' class='link-3'>https://www.hatiri.tech/privacy</a><br><br><span class='text-span-10'>Termination</span><br>You or hatiri may terminate these Terms at any timewith notice to the other. On termination, you lose the right to access or usethe Offerings. The following will survive termination: Registration and YourAccount, License of your Content to hatiri, Limitation of Liability,Indemnification, Governing Law and the General sections of these Terms, and anyother terms that would naturally survive by their nature. Any amounts owed byeither party prior to termination remain owed after termination. hatiri willhave no liability or responsibility to any user related to or arising out ofany termination of access to the Offerings.<br><br><span class='text-span-11'>Changes to Terms</span><br>hatiri may, in its sole discretion, modify or revise these Terms, including without limitation hatiri's Privacy Notice and any referenced policies, at any time by posting the amended terms on the Offerings or otherwise linking to them in the Offerings. <br><br>hatiri additionally may either: (1) notify you via the contact information associated with your account if you have registered with the Offerings (you must ensure that hatiri's or hatiri's email is not filtered from your Inbox by your ISP or email software), or (2) post the date of the update on the Terms, Privacy Notice, or other applicable policies. You agree that your use of the Offerings after the date on which the Terms changed will constitute your acceptance of the updated Terms, and that you agree to be bound by such modifications or revisions.<br><br><span class='text-span-9'>Contacting Us</span><br>If you have any concerns about this End User Agreement, want to ask any questions or would like to discuss anything to do with theTerms, please contact us using the details below and we will respond as soon as reasonably possible. <br><br><strong>hatiri Pty Ltd</strong><br>11 Egerton Street,<br>Silverwater NSW 2128<br>‍<a href='mailto:support@propedge.com.au' class='link-2'>support@propedge.com.au</a></p><div class='spacer-100px'></div></div>",
      },
    ]
  }

  async systemRegions() {
    try {
      const filePath = app.makePath('types/country.json')
      const fileContent = await readFile(filePath, 'utf-8')
      const parsed = JSON.parse(fileContent)

      return { countries: parsed.countries }
    } catch (e) {
      return { error: e.message }
    }
  }

  async userTypes() {}
}
