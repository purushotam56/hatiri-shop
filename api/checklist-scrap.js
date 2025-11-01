async function mainFn() {
  const finalZones = []

  async function getDataForZone(zone) {
    const elements = []

    try {
      const d = await fetch(
        `https://api.propedge.com.au/api/v1/admin/checklist-management/zones/${zone.id}/elements?tmp`,
        {
          headers: {
            accept: '*/*',
          },
          body: null,
          method: 'GET',
        }
      ).then((tmp) => tmp.json())

      for (ele of d.data) {
        const defects = await fetch(
          `https://api.propedge.com.au/api/v1/admin/checklist-management/zones/622a6801c8a3ffb9de21bfcc/elements/${ele.id}/defects`,
          {
            headers: {
              accept: '*/*',
            },
            body: null,
            method: 'GET',
          }
        ).then((tmp) => tmp.json())

        delete ele.created_at
        delete ele.updated_at

        const obj = {
          ...ele,
          defects: (defects.data || []).map((d) => {
            delete d.created_at
            delete d.updated_at
            return d
          }),
          sublist: [],
        }

        if (Array.isArray(ele.checklist_sub_elements)) {
          for (sele of ele.checklist_sub_elements) {
            delete sele.created_at
            delete sele.updated_at
            const sdefects = await fetch(
              `https://api.propedge.com.au/api/v1/admin/checklist-management/zones/622a6801c8a3ffb9de21bfcc/elements/${ele.id}/sub-element/${sele.id}/defects`,
              {
                headers: {
                  accept: '*/*',
                },
                body: null,
                method: 'GET',
              }
            ).then((tmp) => tmp.json())
            const sobj = {
              ...sele,
              sdefects,
            }
            obj.sublist.push({
              ...sele,
              defects: (sdefects.data || []).map((d) => {
                delete d.created_at
                delete d.updated_at
                return d
              }),
            })
          }
        }
        elements.push(obj)
      }
    } catch (e) {
      console.log(e)
    }
    finalZones.push({
      ...zone,
      elements,
    })
    // console.log(elements)
  }

  const zones = [
    {
      name: 'Entrance',
      order: 1,
      stage: 'all',
      id: '622a6801c8a3ffb9de21bfcc',
    },
    {
      name: 'Living',
      order: 2,
      stage: 'all',
      id: '622a69376aa70524cf6224ca',
    },
    {
      name: 'Kitchen',
      order: 3,
      stage: 'all',
      id: '622a69626aa70524cf6224cd',
    },
    {
      name: 'Laundry',
      order: 4,
      stage: 'all',
      id: '622a69756aa70524cf6224d0',
    },
    {
      name: 'Hallway',
      order: 5,
      stage: 'all',
      id: '622a69e66aa70524cf6224d3',
    },
    {
      name: 'Study',
      order: 6,
      stage: 'all',
      id: '622a6a016aa70524cf6224d6',
    },
    {
      name: 'Bedroom 1',
      order: 7,
      stage: 'all',
      id: '622a6b646aa70524cf6224d9',
    },
    {
      name: 'Bedroom 2',
      order: 8,
      stage: 'all',
      id: '622a6b6a6aa70524cf6224dc',
    },
    {
      name: 'Bedroom 3',
      order: 9,
      stage: 'all',
      id: '622a6bbd6aa70524cf6224df',
    },
    {
      name: 'Bedroom 4',
      order: 10,
      stage: 'all',
      id: '622a6bcb6aa70524cf6224e2',
    },
    {
      name: 'Bedroom 5',
      order: 11,
      stage: 'all',
      id: '663d16fbebaa79f429a0d640',
    },
    {
      name: 'Bathroom 1',
      order: 12,
      stage: 'all',
      id: '622a6c176aa70524cf6224e5',
    },
    {
      name: 'Bathroom 2',
      order: 13,
      stage: 'all',
      id: '663d172febaa79f429a0d641',
    },
    {
      name: 'Bathroom 3',
      order: 14,
      stage: 'all',
      id: '663d1750ebaa79f429a0d642',
    },
    {
      name: 'Bathroom 4',
      order: 15,
      stage: 'all',
      id: '663d1769ebaa79f429a0d643',
    },
    {
      name: 'Bathroom 5',
      order: 16,
      stage: 'all',
      id: '663d177debaa79f429a0d644',
    },
    {
      name: 'Ensuite 1',
      order: 17,
      stage: 'all',
      id: '622a6caf6aa70524cf6224eb',
    },
    {
      name: 'Ensuite 2',
      order: 18,
      stage: 'all',
      id: '663d17caebaa79f429a0d645',
    },
    {
      name: 'Ensuite 3',
      order: 19,
      stage: 'all',
      id: '663d17f5ebaa79f429a0d646',
    },
    {
      name: 'Ensuite 4',
      order: 20,
      stage: 'all',
      id: '663d1849ebaa79f429a0d647',
    },
    {
      name: 'Ensuite 5',
      order: 21,
      stage: 'all',
      id: '663d1862ebaa79f429a0d648',
    },
    {
      name: 'Balcony',
      order: 22,
      stage: 'all',
      id: '622a6cf16aa70524cf6224ee',
    },
    {
      name: 'Keys Handover',
      order: 23,
      stage: 'handover',
      id: '6667e108345efe146cbb04da',
    },
  ]

  for (zone of zones) {
    await getDataForZone(zone)
  }
}

mainFn()
