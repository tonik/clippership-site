---
title: Why AI compute should go to sea
description: Clippership's white paper on harvesting ocean energy to power and cool AI inference at sea, with vessel architecture, economics and roadmap.
authors: Niccolo Cymbalist, PhD; Kai Matsuka, PhD; Luca Cymbalist
date: September 2026
location: South San Francisco, CA
cover: /white-paper/cover.jpg
pdf: /clippership-white-paper.pdf
---

## Summary

The demand for AI computing capacity is growing exponentially; however, limitations on the availability of power and opposition from local populations are hampering the construction of new terrestrial data centers. This is pushing data center development into alternative hypothetical environments, including space. We believe that the ocean is a better option. It is rich in available energy, accessible immediately, has unlimited cooling resources (seawater), and involves more predictable and streamlined permitting and regulations than terrestrial data centers.

We propose a class of vessel that harvests energy from the open ocean at capacity factors approaching 90%. It will use a high-lift wind propulsion system coupled with a hydrokinetic turbine system and weather prediction data to route the vessel along a high-energy path. Energy harvested from the ocean will be used to power onboard AI computing and heat-exchanged seawater will be used for cooling. The construction and deployment of a fleet of these vessels will unlock gigawatt-scale AI infrastructure and power its buildout with clean and effectively unlimited ocean energy.

Clippership has identified available shipyard production capacity for 500 MW worth of on-ocean data center vessels deployed by the end of the decade expanding to 1GW/year in early 2030s. Resulting LCOE is between $27/MWh (at simulated 90% capacity factor) and $35/MWh (at 70%).

## The problem

The world's demand for AI compute capacity is surging, while our ability to build land-based data center infrastructure to meet this demand is limited by deliverable power (generation, distribution, and interconnect), and widespread opposition to new terrestrial data center construction, particularly in the United States. These issues will get worse as the scale of data center build-out increases.

Data center power demand is predicted to increase from 31 GW in 2025 to 66GW in 2027 [[Goldman Sachs, 2026]](https://www.goldmansachs.com/insights/articles/us-data-center-power-demand-projected-to-double-by-2027). Power consumed by inference workloads is anticipated to increase from 65% of total in 2024 to 80% of total in 2030 [[Berkeley Lab]](https://escholarship.org/content/qt33m6w3x0/qt33m6w3x0.pdf#page=24). Looking forward, AI agent token usage is expected to hit 120 quadrillion monthly by 2030, a 24x increase versus 2026 baseline [[Goldman Sachs]](https://www.goldmansachs.com/insights/articles/ai-agents-forecast-to-boost-tech-cash-flow-as-usage-soars).

Power availability is constrained by both grid-connection timelines and equipment supply. Large load (including data center) grid connection queue is now over 5 years. DOE reports distribution-transformer lead times of one to two years or longer, while some gas-turbine orders have faced substantially longer waits. Advanced nuclear projects remain primarily in licensing or early construction, so the timing and cost of repeatable behind-the-meter deployments remain uncertain. [[Berkeley Lab](https://emp.lbl.gov/news/backlog-power-plants-seeking-transmission-grid-connection-eased-somewhat-2025-amidst), [DOE](https://www.energy.gov/oe/distribution-transformer-webinar-text-alternative), [NRC](https://www.nrc.gov/reactors/new-reactors/advanced/highlights/index), [Hanwha](https://www.hanwhadatacenters.com/blog/data-center-grid-limitations-the-power-bottleneck/)]

Data center construction pushback at the municipal and state level has rapidly increased in 2026, with data center construction bans and moratoriums increasing from 38 in January to 250 in June, to 385 in August [[Moratorium tracker]](https://www.interconnectedcapital.com/research/data-center-moratoriums), including the statewide moratorium in New York. The result is that it is increasingly difficult to permit and build terrestrial data centers.

These constraints are driving interest in alternatives to terrestrial data centers. The ocean offers plentiful cooling water, tens of terawatts of accessible wind and wave power, and access without launch vehicles. Offshore infrastructure occupies sparsely used areas and may face less local opposition far from coastlines. Increasingly available gigabit satellite links provide connectivity.

## The Clippership solution

Modern large sailing vessels harvest megawatts of power from the wind, using it to propel the vessel through the water, loaded with cargo or passengers. Most of this power can be recovered and converted to electricity using hydrokinetic water turbines.

Wind-powered ships driving underwater turbines have been proposed since the 1980s, and tested as recently as 2024 by Mitsui OSK Lines, the large Japanese shipping line, [[MOL]](https://www.mol-service.com/en/services/low-carbon-decarbonized-business/wind-hunter). This concept suffers from the 'stranded power' issue – or how to transfer the generated power to consumers. Hydrogen has frequently been proposed as the medium. This requires complex onboard hydrogen production and storage equipment and incurs efficiency losses approaching 60%. Using electrical power directly onboard to power AI compute eliminates the stranded power issue, and unlocks virtually unlimited clean ocean power adjacent to virtually unlimited cooling water.

![Conceptual 3MWe catamaran with four wing sails](/white-paper/vessel-concept.jpg) ![Underside view showing the two hydrokinetic turbines in red](/white-paper/vessel-turbines.jpg)

Figure 1. Conceptual 3MWe vessel diagram. 70m LOA, 4x250sqm wing sails, 2x5.5m hydrokinetic turbines (red).

Clippership is developing autonomous wind-powered vessels with hydrokinetic turbines rated at 3 MWe[^mwe], supporting 1,650 late-generation (1200W TDP) accelerators[^tdp] (see Figure 1). Weather-based routing yields simulated capacity factors approaching 90%, versus the cited 40–60% for offshore wind. Conventional marine LNG generation provides backup power. Table 1 reports capacity factor and intermittency from four years of routing simulations (2022–2025) in an area between California, Hawaii, and Alaska, using NOAA GFS 0.25-degree historical forecast data [[NCEP]](https://gdex.ucar.edu/datasets/d084001/). Visual simulation and routing output over one year is available [here](https://drive.google.com/file/d/1z6vZCOl0h5Pkv6mXrG5Wvv_BAMGEuQrQ/view?usp=sharing). P75/P90 show probability of power output exceeding value shown in table for each year considered.

Table 1. Capacity factor and intermittency metrics for 3MW nameplate vessel residing in Pacific Ocean

| Year | Cap. factor | Hours > 2.7 MWe | Hours < 2 MWe | P75 power, MWe | P90 power, MWe |
| ---- | ----------- | --------------- | ------------- | -------------- | -------------- |
| 2022 | 87.92%      | 6,234           | 1,362         | 2.592          | 1.563          |
| 2023 | 89.25%      | 6,570           | 1,110         | 2.700          | 1.691          |
| 2024 | 88.37%      | 6,258           | 1,290         | 2.605          | 1.674          |
| 2025 | 88.12%      | 6,168           | 1,260         | 2.597          | 1.660          |

![Wind speed map of the North Pacific with a year of simulated vessel tracks](/white-paper/route-simulation.jpg)

Figure 2. Year-long (2025-2026) simulated Pacific route achieving capacity factor of ~90% vs nameplate 3MW hydrokinetic power recovery [[full route simulation]](https://drive.google.com/file/d/1z6vZCOl0h5Pkv6mXrG5Wvv_BAMGEuQrQ/view?usp=sharing)

The vessels are designed to accept standard modular data center compute units in 40' containers (Crusoe Spark or Armada Galleon units, for example).

Clippership estimates 160,000 gross tons of vessels per gigawatt of generation capacity, roughly one large cruise ship. A 10 GWe fleet would therefore total approximately 1.6 million GT. For comparison, South Korean shipbuilding capacity is about 18 million GT annually [[OECD]](https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/04/peer-review-of-the-korean-shipbuilding-industry_a2993504/c19e0105-en.pdf). These figures provide a benchmark for the scale of construction required; identified shipyard capacity is detailed below.

## Vessel and system architecture

At its core, the Clippership vessel is a system that uses the thrust from the wind to overcome both hull resistance and induced hydrokinetic turbine resistance, or:

<p class="equation"><i>F</i><sub>drive</sub> = <i>R</i><sub>h</sub> + <i>R</i><sub>t</sub></p>

<i>F</i><sub>drive</sub> is the wing thrust, <i>R</i><sub>h</sub> is hull and appendage resistance, and <i>R</i><sub>t</sub> is turbine resistance. Simplified interactive power calculation model can be found [here](https://boat-wing-hydro-app.niccolo-cymbalist.chatgpt.site/).

Based on this model, for a conceptual 70-meter, 3MWe-class catamaran vessel with 1000 square meters of active suction wing (4 x 250 sqm, <i>C</i><sub>L</sub> = 7) in 10.5 m/s of true wind on a beam reach and travelling at 16 knots, a representative force balance then becomes:

<p class="equation">570 kN (<i>F</i><sub>drive</sub>) = 100 kN (<i>R</i><sub>h</sub>) + 470 kN (<i>R</i><sub>t</sub>)</p>

To harness the power of the wind, convert it to usable electrical power, and house the powered payload, Clippership vessels have 3 main subsystems:

1. **Rigid wing system** that extracts power from the wind and converts it into vessel forward thrust. A medium-sized 70-meter (3MWe rated power generation capacity) vessel will have about 1000 square meters of wing area (on the order of the blade area of a 3MWe wind turbine). Clippership has developed and tested over the past two years and is being extensively tested on open ocean. Current development efforts are focused on increasing the lift coefficient of the passive wing from current Cl = 2.6, to Cl ~ 7 using active suction systems of equivalent thrust to those developed by bound4blue (stated Cl=8.3) and others.

   ![Clippership wing on an autonomous hull sailing in strong wind](/white-paper/wing-testing.jpg)

   Figure 3. Clippership wing system and autonomous hull undergoing on-ocean testing in strong wind conditions. Power harvested by the wing estimated at 13.6 kW (3.8 kN thrust at 7 knots vessel speed).

2. **The hydrogeneration system** that extracts power from the movement of the vessel through the water. This consists of an underwater 7-meter diameter axial hydrokinetic turbine driving a 3MWe generator at a vessel speed of 8 m/s (or two 5.5-meter diameter 1.5MWe turbines). The hydrokinetic turbine diameter is considerably smaller than that of a wind turbine of equivalent power (7-meter versus 130-meter diameter) due to the 800-fold density difference between air and water. Hydrokinetic turbine components do not require specialized supply chains, and are based on existing hydrokinetic turbines developed for tidal power projects, for example those deployed by [Orbital Marine](https://www.orbitalmarine.com/o2/), and share considerable overlap with wind turbine supply chains.

3. **The autonomous hull**, containing the data hall, power electronics, heat-exchanged cooling loops, backup power generation equipment, autonomous control systems, communication and navigation equipment. Notably, given abundant cold (15-18 degC) seawater available in planned area of operation for heat-exchanged liquid cooling, anticipated PUE is on the order of 1.05. The hulls are designed to be manufactured at shipyards anywhere in the US or abroad. We have a strong relationship with a shipyard in Vietnam that has produced initial 10 kWe compute node vessel prototypes and will produce the early MWe class fleet. We have identified additional shipyard capacity to achieve 1GWe annual production by 2032. We expect production of these vessels to move to the US as the domestic maritime industrial base is rebuilt.

## The economics

A useful approach to comparing the costs of the proposed on-ocean compute vessels to terrestrial data centers is to split out the power generation system (including wing systems, hydrokinetic generator, and associated power electronics) from the vessel itself that houses the compute hardware, cooling systems, backup power generation, UPS, and other data center systems with analogous terrestrial data center systems. The power generation system can then have an LCOE associated with it, and the rest of the vessel can be benchmarked against a terrestrial powered and cooled data center shell costs.

Table 2. 3MW vessel hull construction costs (powered and cooled shell)

| Cost item                                | Cost            | Notes                                                                                                                                                                             |
| ---------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hull                                     | $6,250,000      | Based on a hull structure mass of 240 tons, and $26/kg aluminum construction [quoted].                                                                                            |
| Outfit excluding backup power generation | $5,800,000      | Includes standard marine outfitting, auxiliary propulsion, electrical system, data hall shell. Excludes IT-specific electrical system                                             |
| 3 MW power backup system                 | $4,700,000      | Incudes LNG gensets and cryogenic LNG storage tanks, gasification train, and other systems                                                                                        |
| Project costs & contingency              | $2,000,000      |                                                                                                                                                                                   |
| **Total**                                | **$18,750,000** | In line with similar (but more complex) vessels [[Austal]](https://www.austal.com/media-releases/austal-awarded-eu205m-contract-build-66-metre-high-speed-catamaran-ferry-french) |

Resulting powered and cooled shell cost is on the order of $6.2M/MWe electrical power capacity. Unsurprisingly, this is close to an equivalent terrestrial powered and cooled shell per MW electrical power, estimated at between $5.5M/MWe and $6.5M/MWe [[Turner & Townsend]](https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/data-centre-cost-trends). Current terrestrial powered shell revenue stands at $2.1M MWe/yr ($175 kWe-month, and increasing every quarter as supply tightens and demand increases, [[CBRE]](https://www.cbre.com/insights/reports/global-data-center-trends-2026)) exclusive of electricity and cooling.

Table 3. 3MW hydrokinetic turbine and wing system (power generation) costs

| Cost item                     | Cost           | Notes                                                         |
| ----------------------------- | -------------- | ------------------------------------------------------------- |
| Wing system                   | $2,680,000     | Modern WASP system designed for manufacturing at scale[^wing] |
| Hydrokinetic generator system | $2,550,000     | Marinized equivalent wind turbine costing exercise[^turbine]  |
| **Total**                     | **$5,230,000** |                                                               |

Resulting LCOE for the wing + hydrokinetic turbine system is therefore approximately $27/MWh at the 90% capacity factor achieved in simulation.[^lcoe] Reducing capacity factor to 80% drives up LCOE to $31/MWh, and 70% to $35/MWh. This is lower than domestic onshore and offshore wind (currently $61 and $114 per MWh, respectively [[Lazard]](https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf)) and is comparable to Chinese onshore wind power at $29/MWh, one of the lowest cost energy sources on the planet [[Bloomberg]](https://about.bnef.com/insights/clean-energy/global-cost-of-renewables-to-continue-falling-in-2025-as-china-extends-manufacturing-lead-bloombergnef/).

Operating costs for the 70-m autonomous vessel are estimated to be between $0.8M and $1.7M per year, based on operating costs of equivalent conventional vessels [[Tidewater]](https://financialfilings.com/filings/tidewater-inc/annual-report/2026/32878771/) exclusive of crew costs ($1M-$1.3M). This is also quite close to operating costs of an equivalent terrestrial data center, exclusive of power. LNG fuel costs needed to achieve 100% capacity factor at full 3MWe load are $280k/year as of September 2026, and track LNG bunker benchmarks [[S&P Global]](https://www.spglobal.com/energy/en/news-research/infographics/content-design-infographics/platts-global-bunker-cost-calculator).

For reference, current base case terrestrial powered shell revenue is $2.1M MW/yr ($175 kW-month, and increasing every quarter as supply tightens and demand increases, [CBRE](https://www.cbre.com/insights/reports/global-data-center-trends-2026)) exclusive of electrical power. A single 3MWe vessel can then generate $6.3M/year as a powered shell today. Selling on power at a competitive rate of $60/MWh increases revenue by $1.5M.

Table 4. Illustrative payback period sensitivity

|                  | Poor  | Base  | Good   |
| ---------------- | ----- | ----- | ------ |
| Revenue ($M)     | $6.50 | $7.80 | $11.50 |
| Vessel cost ($M) | $28   | $24   | $20    |
| Opex ($M)        | $2    | $1.50 | $1     |
| Payback (years)  | 6.2   | 3.8   | 1.9    |

Table 4 shows sensitivity of unit economics to poor revenue condition ($140/kW powered shell rental per month, $50/MWh power), and higher than expected vessel cost and Opex resulting in a payback period of just over 6 years. Conversely, good revenue conditions ($250/kW monthly powered shell rental, $100/MWh power offtake), vessel build cost reduction, and a reduction in Opex result in a lower payback time of about 2 years.

## Roadmap

**October 2026.** Launch our first two dedicated [sense and compute vessels](https://artifact-7f4c29.niccolo-cymbalist.chatgpt.site/), each rated at 10 kWe and powering eight NVIDIA GPUs with heat-exchanged seawater cooling. They will serve maritime and government customers requiring local modeling and analysis, including bathymetry, video and radar processing from hull-mounted sensors or daughter UUVs/USVs, and weather prediction beyond the compute capacity of smaller craft. Validates end-to-end power generation through useful AI workloads. Provides early indicative information on uptime and bandwidth.

![Render of the 10 kWe sense and compute vessel](/white-paper/sense-compute-node.jpg) ![Second aluminium hull under construction at the partner shipyard](/white-paper/hull-construction.jpg)

Figure 4. Sense and compute node. Second hull under construction at partner shipyard (right).

**Q2 2027.** Launch scaled-up 0.25 MWe-class data center vessel. It will be used as a platform to test and validate the scaled-up power generation stack (rigid wing system through hydrokinetic turbine), and the routing optimization, with an emphasis on demonstrating the capacity factor and uptime over a representative period, in a representative area of operations. This vessel will be able to host, power, and cool approximately 150 accelerators, and will be available for limited commercial deployment for customers requiring isolated, sovereign AI compute resource.

**Q2 2028.** Launch first 3 MWe-class prototype. This class of vessel will have the capability to act as a drop-in replacement for latency-insensitive inference workloads currently assigned to terrestrial data centers. Validates full-scale node, end-to-end.

**Q2 2029.** Launch production of 3 MWe class data center vessel once design has been validated and frozen, targeting 1 GWe (300 vessels) per year by early 2030s.

## The hard questions

### How will you handle bandwidth and latency limitations? How will they affect serviceable AI workload?

SpaceX has filed plans with the FCC to launch up to 100,000 3rd generation Starlink satellites into VLEO, offering multi-gigabit symmetrical throughput. Amazon is targeting gigabit speeds with its Kuiper constellation, currently numbering 390 satellites [[FCC](https://fccprod.servicenowservices.com/ibfs?id=ibfs_application_summary&number=SAT-LOA-20260630-00264), [Amazon](https://www.aboutamazon.com/news/amazon-leo/amazon-leo-satellite-internet-ultra-pro)]. Blue Origin plans to roll out its TeraWave product capable of symmetrical 144 Gbps in RF starting Q4 of 2027 [[Blue Origin]](https://www.blueorigin.com/news/blue-origin-introduces-terawave-space-based-network-for-global-connectivity).

Early 0.25 MWe prototypes and the 3 MWe prototype vessels will use the currently available 6x Bonded Performance Starlink service achieving gigabit speeds (2.4 Gbps downlink and 600 Mbps uplink), with latency between 50ms and 100ms. Vessels requiring higher bandwidth earlier than next-generation gigabit options become widely available will incorporate [Starlink Gateway](https://starlink.com/business/transit) units that are specifically designed for telecom infrastructure (including data center) connectivity, and have been successfully deployed in maritime environments [[SpaceX]](https://starlink.com/as/support/article/2d582f65-f744-529d-268a-6e2e9f777c68#what-is-starlink-dedicated-service).

Recent inference studies (based on tok/s and GPU power) report between 1 and 2 Mbps/kW compute ingress bandwidth requirements, and about 100-fold lower egress bandwidth requirements for agentic workloads [[DeepSeek](https://github.com/deepseek-ai/open-infra-index/blob/main/202502OpenSourceWeek/day_6_one_more_thing_deepseekV3R1_inference_system_overview.md), [SemiAnalysis](https://inferencex.semianalysis.com/blog/agentx-inferencexv3-does-cuda-moat)]. For a 3MWe vessel powering approximately 2 MW compute hardware, this would require between 2 and 4 Gbps ingress, and sub-500 Mbps egress.

### How will you ensure the onboard hardware remains safe and protected from the marine environment? How is it serviced?

Onboard IT hardware will be housed in a sealed and nitrogen-purged data hall. Microsoft's [Project Natick](https://natick.research.microsoft.com/) demonstrated the effectiveness of a nitrogen-purged sealed environment in a marine data center pilot, achieving a failure rate of 1/8th that of terrestrial data centers. The vessels will periodically navigate, under backup power, to service ports located on the closest suitable coast. There, vessel technicians will perform routine vessel maintenance tasks, while concurrent data center hardware maintenance and updates can be performed.

### How is this better than offshore wind turbines, advanced wave energy solutions, or offshore nuclear?

The ability for the vessels to move under their own power unlocks capacity factors approaching 90%, about double those currently achieved by floating or fixed turbine-based offshore wind installations. It also effectively eliminates any offshore construction activity that is a major cost driver of offshore wind installations. The vessels operate in international deep water away from coastlines, therefore are not susceptible to the same levels of public scrutiny and political pushback seen by offshore wind installations.

Advanced wave energy also benefits from the advantages of international deep-water operation, but limited mobility of the platform reduces capacity factor, complicates outbound transit to area of operation and return transit for maintenance and overhaul.

Offshore nuclear is attractive, but is reliant on widespread deployment of marine SMR technology whose development has only just started, whose build and operating costs are yet unclear, and that is unlikely to see any substantial deployment in the next decade. The vessels we are developing leverage existing technology and marine CONOPS, enhanced by the wing-sail energy harvesting systems that we have already developed and demonstrated.

### What is the regulatory environment and roadmap to deploying gigawatt-scale on-ocean compute?

The regulatory pathway for our autonomous surface vehicles is navigable, and actively being built out by regulators. Our vessels route through the dedicated review track the USCG created for uncrewed and autonomous systems in their Work Instruction, published in June of 2026 [[USCG CG-5P]](https://www.news.uscg.mil/maritime-commons/Article/4509546/coast-guard-assistant-commandant-for-prevention-policy-cg-5p-publishes-guidance/). We have been in sustained engagement with U.S. and international maritime-autonomy regulators since 2024 and are executing a phased deployment plan for uncrewed autonomous vessels. We engage closely with USCG Sector San Francisco for our routine autonomous operations in the Bay and offshore. [[USCG Clippership LNM]](https://www.navcen.uscg.gov/sites/default/files/pdf/lnms/lnm11172026.pdf)

### How fast can you deploy? 1 GWe per year corresponds to ~330 vessels per year, which is a lot!

We have identified 300 MWe/year of shipyard capacity available after design validation and freeze across six Vietnamese yards: HHSY, HG Shipyard, Song Cam, 189 Yard, Ba Son, and Nam Trieu. These yards are in contact with us or already building our vessels and report capacity of up to twenty 3 MW vessels each annually. Our planning total is approximately 100 vessels per year, with typical build times of 12–14 months. Expansion into the Philippines, South Korea, and eventually the US could bring production to 1 GWe/year.

The wing system and hydrokinetic turbine system shares a supply chain with utility scale wind turbines (blades and nacelles), that currently has an installed manufacturing capacity approaching 285 GW/year.

## Interactive visualizations

1. [One-year route simulation](https://drive.google.com/file/d/1z6vZCOl0h5Pkv6mXrG5Wvv_BAMGEuQrQ/view?usp=sharing)
2. [Vessel power model](https://boat-wing-hydro-app.niccolo-cymbalist.chatgpt.site/)
3. [10 kWe, 8× NVIDIA RTX 6000 Blackwell vessel visualization](https://artifact-7f4c29.niccolo-cymbalist.chatgpt.site/)

## About Clippership

We are a team of sailors, aerodynamicists, mechanical, electrical, and software engineers and technicians, and special forces soldiers dedicated to harnessing the power of the oceans to help solve the problems humanity faces today. In our previous lives we built humanoid robots and rocket-powered cars at Tesla, autonomous spacecraft at NASA-JPL, race cars with the Mercedes F1 team, ships at Damen, codebases at Microsoft, and have deployed in combat theatres around the world.

We're proud to build in South San Francisco. Hit us up at [hello@clippership.co](mailto:hello@clippership.co).

[^mwe]: Throughout this paper, MWe references electrical power generation or consumption, while 'MW compute' references cumulative accelerator thermal design power (TDP).

[^tdp]: An NVIDIA B200 accelerator rated at 1200 W TDP, for example, typically consumes about 85%-95% of TDP during heavy, consistent token generation. Non-GPU components add about an additional 4.5kW per node of 8 GPUs. The sum is then multiplied by the facility PUE (1.05 in our case, thanks to seawater cooling), resulting in an electrical peak power consumption of 1750 W. [[Sphereon]](https://www.spheron.network/blog/ai-inference-power-electricity-cost-2026/)

[^wing]: The composite wing, flap, and primary structural components account for roughly $290k per wing, while the active-suction system adds approximately $130k. Rotation, actuation, controls, electrical systems, and marine hardware contribute approximately $90k. Assembly, testing, factory overhead, warranty, and manufacturer margin make up the remaining approximately $160k per wing, for a total of $2.68M for the 4x250sqm wings.

[^turbine]: Major mechanical components include the blades ($360k), hub and pitch system ($160k), shaft and bearings ($200k), and gearbox ($260k), totaling approximately $980k. The generator, power converter, transformer, and associated electrical equipment contribute approximately $580k. Marine-specific systems—including the pressure housing, shaft seals, cooling, controls, cabling, and corrosion protection—add approximately $670k. Final assembly, factory testing, integration, and margin $320k.

[^lcoe]: Initial capital cost of $5.23 million and a nameplate electrical output of 3 MWe. At a 90% capacity factor, the system would generate approx. 23,652 MWh/yr. Assuming a 25-year economic life and an 8% real WACC, the corresponding capital recovery factor is 9.37% per year, resulting in an annualized capital cost of approximately $490,000. Depreciation is assumed to be straight-line over the 25-year asset life, equivalent to $209,000 per year for accounting purposes. Fixed operations and maintenance costs are assumed to equal 3% of initial CAPEX, or approximately $157,000 per year.
