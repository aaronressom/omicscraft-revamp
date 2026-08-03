/**
 * OmicsCraft LLC - Financial Conflicts of Interest Policy.
 *
 * VERBATIM COMPLIANCE DOCUMENT. Extracted programmatically from
 * https://www.omicscraft.com/research - not retyped - so the wording matches
 * the published policy exactly. Do not edit, condense, or reformat the text.
 *
 * The PHS FCOI regulations require this policy to be publicly accessible, so
 * it must remain reachable on the site rather than being dropped in the
 * redesign. It lives in a collapsed accordion on /projects.
 */

export type FcoiItem = { bullet: boolean; text: string };
export type FcoiSection = { heading: string | null; items: FcoiItem[] };

export const FCOI_TITLE = 'Financial Conflicts of Interest Policy';
export const FCOI_ORG = 'OmicsCraft LLC';
export const FCOI_EFFECTIVE = 'Effective Date: January 26, 2022';

export const FCOI_SECTIONS: FcoiSection[] = [
  {
    heading: null,
    items: [
      {
        bullet: false,
        text: "Policy Statement. OMICSCRAFT is committed to ensure the integrity of its research and to comply with the federal Public Health Service’s (PHS) requirements and regulations (Title 42 Code of Federal Regulations (CFR), Part 50, Subpart F, Responsibility of Applicants for Promoting Objectivity in Research for Which PHS Funding is Sought)) for institutions that seek research funding. OMICSCRAFT’s Financial Conflicts of Interest (FCOI) Policy seeks to identify potential, actual, or apparent financial conflicts of interest, and provides processes for disclosure of FCOIs and eliminating and/or managing them as appropriate. OMICSCRAFT’s Investigators participating in any Research or Research through subgrantees, contractors, or collaborators that are funded by any PHS agency or any non-PHS organization that has adopted the PHS FCOI Regulations are required to comply with this Policy. This Policy is effective as of January 26, 2022 and will be updated annually, maintained, and made publicly accessible in compliance with the most up-to-date FCOI regulations."
      }
    ]
  },
  {
    heading: "Definitions",
    items: [
      {
        bullet: true,
        text: "Disclosure of significant financial interests means an Investigator’s disclosure of significant financial interests (SFIs) to an Institution."
      },
      {
        bullet: true,
        text: "Financial conflict of interest (FCOI) means a significant financial interest that could directly and significantly affect the design, conduct, or reporting of PHS-funded research."
      },
      {
        bullet: true,
        text: "FCOI report means an Institution’s report of a financial conflict of interest to a PHS Awarding Component."
      },
      {
        bullet: true,
        text: "Financial interest means anything of monetary value, whether the value is readily ascertainable."
      },
      {
        bullet: true,
        text: "HHS means the United States Department of Health and Human Services, and any components of the Department to which the authority involved may be delegated."
      },
      {
        bullet: true,
        text: "Institution means any domestic or foreign, public, or private, entity or organization (excluding a Federal agency) that is applying for, or that receives, PHS research funding."
      },
      {
        bullet: true,
        text: "Institutional responsibilities mean an Investigator’s professional responsibilities on behalf of the Institution, and as defined by the Institution in its policy on financial conflicts of interest, which may include for example: activities such as research, research consultation, teaching, professional practice, institutional committee memberships, and service on panels such as Institutional Review Boards or Data and Safety Monitoring Boards."
      },
      {
        bullet: true,
        text: "Investigator means the project director or principal Investigator and any other person, regardless of title or position, who is responsible for the design, conduct, or reporting of research funded by the PHS, or proposed for such funding, which may include, for example, collaborators or consultants."
      },
      {
        bullet: true,
        text: "Manage means taking action to address a financial conflict of interest, which can include reducing or eliminating the financial conflict of interest, to ensure, to the extent possible, that the design, conduct, and reporting of research will be free from bias."
      },
      {
        bullet: true,
        text: "PD/PI means a project director or principal Investigator of a PHS-funded research project; the PD/PI is included in the definitions of senior/key personnel and Investigator under this subpart."
      },
      {
        bullet: true,
        text: "PHS means the Public Health Service of the U.S. Department of Health and Human Services, and any components of the PHS to which the authority involved may be delegated, including the National Institutes of Health (NIH)."
      },
      {
        bullet: true,
        text: "PHS Awarding Component means the organizational unit of the PHS that funds the research that is subject to this subpart."
      },
      {
        bullet: true,
        text: "Public Health Service Act or PHS Act means the statute codified at 42 U.S.C. 201 et seq."
      },
      {
        bullet: true,
        text: "Research means a systematic investigation, study or experiment designed to develop or contribute to generalizable knowledge relating broadly to public health, including behavioral and social-sciences research. The term encompasses basic and applied research (e.g., a published article, book, or book chapter) and product development (e.g., a diagnostic test, software, or drug). As used in this subpart, the term includes any such activity for which research funding is available from a PHS Awarding Component through a grant or cooperative agreement, whether authorized under the PHS Act or other statutory authority, such as a research grant, career development award, center grant, individual fellowship award, infrastructure award, institutional training grant, program project, or research resources award."
      },
      {
        bullet: true,
        text: "Senior/key personnel means the PD/PI and any other person identified as senior/key personnel by the Institution in the grant application, progress report, or any other report submitted to the PHS by the Institution under this subpart."
      },
      {
        bullet: true,
        text: "Significant financial interest means:"
      },
      {
        bullet: false,
        text: "(1) A financial interest consisting of one or more of the following interests of the Investigator (and those of the Investigator’s spouse and dependent children) that reasonably appears to be related to the Investigator’s institutional responsibilities:"
      },
      {
        bullet: false,
        text: "(a) With regard to any publicly traded entity, a significant financial interest exists if the value of any remuneration received from the entity in the twelve months preceding the disclosure and the value of any equity interest in the entity as of the date of disclosure, when aggregated, exceeds $5,000. For purposes of this definition, remuneration includes salary and any payment for services not otherwise identified as salary (e.g., consulting fees, honoraria, paid authorship); equity interest includes any stock, stock option, or other ownership interest, as determined through reference to public prices or other reasonable measures of fair market value;"
      },
      {
        bullet: false,
        text: "(b) With regard to any non-publicly traded entity, a significant financial interest exists if the value of any remuneration received from the entity in the twelve months preceding the disclosure, when aggregated, exceeds $5,000, or when the Investigator (or the Investigator’s spouse or dependent children) holds any equity interest (e.g., stock, stock option, or other ownership interest); or"
      },
      {
        bullet: false,
        text: "(c) Intellectual property rights and interests (e.g., patents, copyrights), upon receipt of income related to such rights and interests."
      },
      {
        bullet: false,
        text: "(2) Investigators also must disclose the occurrence of any reimbursed or sponsored travel (i.e., that which is paid on behalf of the Investigator and not reimbursed to the Investigator so that the exact monetary value may not be readily available), related to their institutional responsibilities; provided, however, that this disclosure requirement does not apply to travel that is reimbursed or sponsored by a Federal, state, or local government agency, an Institution of higher education as defined at 20 U.S.C. 1001(a), an academic teaching hospital, a medical center, or a research institute that is affiliated with an Institution of higher education. The Institution’s FCOI policy will specify the details of this disclosure, which will include, at a minimum, the purpose of the trip, the identity of the sponsor/organizer, the destination, and the duration. In accordance with the Institution’s FCOI policy, the institutional official(s) will determine if further information is needed, including a determination or disclosure of monetary value, in order to determine whether the travel constitutes an FCOI with the PHS-funded research."
      },
      {
        bullet: false,
        text: "(3) The term significant financial interest does NOT include the following types of financial interests: salary, royalties, or other remuneration paid by the Institution to the Investigator if the Investigator is currently employed or otherwise appointed by the Institution, including intellectual property rights assigned to the Institution and agreements to share in royalties related to such rights; any ownership interest in the Institution held by the Investigator, if the Institution is a commercial or for-profit organization; income from investment vehicles, such as mutual funds and retirement accounts, as long as the Investigator does not directly control the investment decisions made in these vehicles; income from seminars, lectures, or teaching engagements sponsored by a Federal, state, or local government agency, an Institution of higher education as defined at 20 U.S.C. 1001(a), an academic teaching hospital, a medical center, or a research institute that is affiliated with an Institution of higher education; or income from service on advisory committees or review panels for a Federal, state, or local government agency, an Institution of higher education as defined at 20 U.S.C. 1001(a), an academic teaching hospital, a medical center, or a research institute that is affiliated with an Institution of higher education."
      },
      {
        bullet: true,
        text: "Small Business Innovation Research (SBIR) Program means the extramural research program for small businesses that is established by the Awarding Components of the Public Health Service and certain other Federal agencies under Public Law 97-219, the Small Business Innovation Development Act, as amended. For purposes of this subpart, the term SBIR Program also includes the Small Business Technology Transfer (STTR) Program, which was established by Public Law 102-564."
      }
    ]
  },
  {
    heading: "Policy Instructions and Disclosure Procedures",
    items: [
      {
        bullet: true,
        text: "Responsibilities of the Institution"
      },
      {
        bullet: false,
        text: "(1) In compliance with PHS FCOI Regulations, OMICSCRAFT’s Signing Official (SO) will ensure that all Investigators are informed of and in compliance with this Policy regarding financial conflicts of interest, the Investigator’s responsibilities of disclosing SFI’s, and with PHS FCOI Regulations."
      },
      {
        bullet: false,
        text: "(2) As applicable, the SO will maintain records of all Investigator disclosures of financial interests and OMICSCRAFT’s review of, and response to, such disclosures under OMICSCRAFT’s Policy or retrospective review, regardless of whether a disclosure resulted in the OMICSCRAFT’s determination of FCOI: (a) For at least three years following the submission date of the final expenditures report or from the date of submission of the quarterly or annual financial report; or (b) From other dates stipulated by 45 C.F.R. 74.53(b) and 92.42(b)."
      },
      {
        bullet: false,
        text: "(3) All records of Investigator disclosures of financial interests and OMICSCRAFT’s review of, and response to, such disclosures will be maintained: (a) In hard copy of the project binder specific to the PHS-funded work; and (b) Electronically, filed in the “FCOI” folder of the project file specific to the PHS-funded work on the server."
      },
      {
        bullet: true,
        text: "Policy Application to Sub-awardees, Subcontractors, and OMICSCRAFT’s Affiliates"
      },
      {
        bullet: false,
        text: "Sub-awardees, subcontractors, and other OMICSCRAFT’s affiliates collaborating on PHS-funded research will be required to confirm that they have their own FCOI policy in place that conforms to PHS FCOI 2011 Regulations prior to a grant being funded. If they do not have their own FCOI policy, they will be required to comply with OMICSCRAFT’s FCOI Policy."
      },
      {
        bullet: true,
        text: "Mandatory Training Requirements"
      },
      {
        bullet: false,
        text: "(1) Per PHS FCOI Regulations, all Investigators will be required to complete FCOI training on both Federal and Institutional policies. This training must be completed prior to engaging in research related to any PHS-funded grant and at least every four years, and immediately if any of the following circumstances apply: (a) The OMICSCRAFT FCOI Policy or procedures contained within or the PHS Financial Disclosure Form are revised in any manner that affects the requirements of Investigators; (b) An Investigator joins OMICSCRAFT; or (c) OMICSCRAFT is made aware of an Investigator who is not in compliance with this FCOI Policy or management plan."
      },
      {
        bullet: false,
        text: "(2) To fulfill the Institutional training requirement, all OMICSCRAFT Investigators will be required to read through this OMICSCRAFT FCOI Policy for PHS Funding and sign to attest to the fact that they have read and understood all policies, rules, and regulations contained within this document, and that they understand their responsibilities as an Investigator to disclose any and all significant financial interests."
      },
      {
        bullet: false,
        text: "(3) To fulfill the Federal training requirement, all OMICSCRAFT investigators must complete the following training program: “Financial Conflict of Interest Online Tutorial” (https://grants.nih.gov/grants/policy/coi/tutorial2018/story_html5.html). At the end of the tutorial, each person should fill out the Certificate of Completion and follow the instructions for documentation."
      },
      {
        bullet: false,
        text: "(4) Exceptions to these training requirements will be managed on a case-by-case basis as needed."
      },
      {
        bullet: false,
        text: "(5) All records of completion of training requirements will be maintained: (a) In hard copy, filed under the appropriate “FCOI Compliance Documentation” binder; and (b) Electronically, filed in the appropriate “Financial Conflict of Interest” folder."
      },
      {
        bullet: true,
        text: "Investigator Disclosure Requirements"
      },
      {
        bullet: false,
        text: "(1) Per PHS FCOI Regulations, it is OMICSCRAFT’s Policy that all SFI’s be disclosed to OMICSCRAFT SO: (a) At the time of application for funding by each Investigator, including subrecipient Investigators as applicable, planning to be involved in PHS/NIH funded research; (b) Annually by each Investigator, including sub-recipient Investigators as applicable, involved with the award for the award period to update disclosures of SFIs; and (c) Within 30 days of an Investigator, including sub-recipient Investigators as applicable, discovering, or acquiring (e.g., through purchase, marriage, or inheritance) a new SFI."
      },
      {
        bullet: false,
        text: "(2) OMICSCRAFT will solicit and review disclosures of SFI(s) of all Investigators and their immediate family (including spouse/domestic partner and/or dependent children) related to the Investigator’s institutional responsibilities. All Investigators will utilize the “Financial Disclosure Form for Investigators in PHS Research” to either disclose SFIs or declare that there are no SFI’s."
      }
    ]
  },
  {
    heading: "Management of Financial Conflicts of Interest",
    items: [
      {
        bullet: true,
        text: "Review of SFI disclosure"
      },
      {
        bullet: false,
        text: "All disclosures of SFIs will be reviewed by OMICSCRAFT’s SO in a prompt manner such that within 60 days of receipt of the disclosure, the SFI can be assessed, a management plan developed, and all reviews and approvals necessary can be obtained. The SO will:"
      },
      {
        bullet: false,
        text: "(1) Record and review all “Financial Disclosure for Investigators in PHS Research” forms from PHS-funded Investigators at OMICSCRAFT;"
      },
      {
        bullet: false,
        text: "(2) Assess the nature of the SFI to determine whether the Investigator working on the PHS-funded research has a FCOI;"
      },
      {
        bullet: false,
        text: "(3) Provide information concerning FCOI’s to the expenditure of PHS funds, which will be updated at least annually and within 60 days of changes to Statement of Financial Interest Disclosure forms, whichever occurs first."
      },
      {
        bullet: true,
        text: "Management of FCOI’s"
      },
      {
        bullet: false,
        text: "The OMICSCRAFT SO will develop a management plan based on the nature of the FCOI and will monitor investigator compliance with the management plan on an ongoing basis until the completion of the PHS-funded research project. Examples of conditions or restrictions that could be established include, but are not limited, to:"
      },
      {
        bullet: false,
        text: "(1) Public disclosure of FCOI’s;"
      },
      {
        bullet: false,
        text: "(2) Appointment of independent monitor(s) who will be able to prevent the FCOI from biasing the design, conduct, and reporting of PHS-funded research;"
      },
      {
        bullet: false,
        text: "(3) Modification of the research plan;"
      },
      {
        bullet: false,
        text: "(4) Change of Investigator(s) or roles/responsibilities of Investigator, or exclusion of Investigator from participating in all or a portion of research;"
      },
      {
        bullet: false,
        text: "(5) Reduction or elimination of the financial interest (e.g., sale of an equity interest); and"
      },
      {
        bullet: false,
        text: "(6) Severance of relationships that create FCOI’s."
      },
      {
        bullet: true,
        text: "OMICSCRAFT Reporting Requirements"
      },
      {
        bullet: false,
        text: "(1) Per PHS FCOI Regulations, OMICSCRAFT will submit to the NIH through the eRA Commons FCOI Module both initial and ongoing FCOI reports: (a) Prior to the expenditure of funds; (b) Within 60 days of identifying a new FCOI during the period of the award; and (c) Annually when grantee is required to submit the annual progress report, including multi-year progress report, or at time of extension, to report on the status of FCOI and any changes in the management plan."
      },
      {
        bullet: false,
        text: "(2) As per the PHS FCOI Regulations, FCOI reports will include: (a) Grant number; (b) PD/PI or contact PD/PI; (c) Name of Investigator with FCOI; (d) Name of entity with which Investigator has FCOI; (e) Nature of FCOI; (f) Value of the financial interest reported as a range ($0-4,999; $5,000-9,999; $10,000-19,999), in increments of $20,000 if between $20,000-100,000, in increments of $50,000 if above $100,000, or a statement that the value cannot be readily determined; (g) Description of how the SFI relates to PHS-funded research and basis for OMICSCRAFT’s determination that the SFI conflicts with this research; and (h) Key elements of OMICSCRAFT’s management plan."
      },
      {
        bullet: true,
        text: "Public availability of FCOI disclosure"
      },
      {
        bullet: false,
        text: "As per the PHS FCOI Regulations, disclosure of SFIs that are still held by the Investigator for the PHS-funded research project, determined by OMICSCRAFT to be related to the PHS-funded research, and determined by OMICSCRAFT to be a FCOI disclosure of FCOI’s will be made available as a written response within five business days of a request. The information made available by OMICSCRAFT on in a written response will include the following information: (a) Name of Investigator with FCOI; (b) Title and role of the Investigator in the PHS-funded research project; (c) Name of entity with which Investigator has FCOI; (d) Nature of the FCOI; and (e) Value of the financial interest, reported as a range ($0-4,999; $5,000-9,999; $10,000-19,999), in increments of $20,000 if between $20,000-100,000, in increments of $50,000 if above $100,000, or a statement that the value cannot be readily determined through references to public prices or other reasonable measures of fair market value."
      }
    ]
  },
  {
    heading: "Enforcement of Policy and Noncompliance",
    items: [
      {
        bullet: true,
        text: "All Investigators and relevant OMICSCRAFT personnel and collaborators are required to comply with this Policy in full. Violations of this policy may result in disciplinary or other appropriate action."
      },
      {
        bullet: true,
        text: "If an FCOI is not identified or managed in a timely manner (including Investigator failure to disclose SFI(s), OMICSCRAFT’s failure to review or manage FCOI(s), or failure to comply with the management plan), OMICSCRAFT will within 120 days of the determination of noncompliance notify the NIH and submit a retrospective review, as per PHS FCOI Regulations. The retrospective review will include the following information: (a) Grant number; (b) Grant title; (c) PD/PI or contact PD/PI; (d) Name of Investigator with FCOI; (e) Name of entity with which Investigator has FCOI; (f) Reason(s) for retrospective review; (g) Detailed methodology used for retrospective review (e.g., details of review process, composition of the review panel, documents reviewed); (h) Findings and conclusions of the review; and (i) If warranted by the retrospective review, update and revise the previously submitted FCOI report."
      },
      {
        bullet: true,
        text: "In the case that a retrospective review finds that Investigator non-compliance with this FCOI Policy, the PHS FCOI Regulations, or a management plan appears to have biased the design, conduct, or reporting of PHS-funded research, OMICSCRAFT will promptly submit a mitigation report to the NIH Awarding Component. The mitigation report will include: (a) Key elements documented in the retrospective review; (b) Description of the impact of bias on the research project; and (c) Management plan(s) to eliminate or mitigate the bias on the design, conduct, or report of research."
      }
    ]
  }
];
